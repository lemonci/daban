#!/bin/bash
#
# This will setup the local firewall policy with iptables
#
# Note that we cannot simply save/restore iptables because the
# docker daemon manages some of the chains/rules
# So instead, we:
# - Set the INPUT and OUTPUT chains to ALLOW by default
# - Clear all rules in the INPUT and OUTPUT chains
# - Apply the rules in our policy
# - Switch the INPUT and OUTPUT chains back to DROP by default
#

# Do not continue if we do not have elevated privileges
if [ "$EUID" -ne 0 ]; then
  echo "This script must be run with elevated privileges (root)"
  exit 1
fi

# Base folder
LOGTAG="fwupdate"
FSIAC=/etc/fw

# Step 0: Validate all ipset files
logger -t $LOGTAG "Validating ipset files in $FSIAC/ipset..."
validation_failed=0
for ipset_file in "$FSIAC"/ipset/*; do
  if [[ -f "$ipset_file" ]]; then
    logger -t $LOGTAG "Validating ipset file: $ipset_file"
    ###########################################################################
    # NOTE:
    # The command below performs a "test restore" of ipset configuration files
    # using the `-T` (test) flag, which verifies the syntax and structure
    # without actually applying any sets to the kernel.
    #
    # However, the `-T` flag is only supported in ipset versions >= 7.22.
    # Debian 12 (Bookworm) ships with ipset 7.17, which does NOT have this flag.
    #
    # Hence, the need for the namespace validation workaround below:
    # we temporarily create an isolated network namespace and run `ipset restore`
    # inside it. This way we safely test each ipset file's syntax and structure
    # without modifying the live system ipsets.
    #
    # Future usage (for ipset >= 7.22):
    # if ! ipset restore -T < "$ipset_file" 2>&1 | logger -t $LOGTAG; then
    #  logger -t $LOGTAG "ERROR: Validation failed for $ipset_file"
    #  validation_failed=1
    # fi
    ###########################################################################

    # --- Namespace-based validation for ipset < 7.22 ---
    # Debian 12 (v7.17) lacks -T, so we test safely in a temp namespace.
    # Create a temporary namespace called "ipsetcheck"
    ip netns add ipsetcheck 2>/dev/null || true
    if ! ip netns exec ipsetcheck bash -c "ipset restore < '$ipset_file'" >/dev/null 2>&1; then
      logger -t $LOGTAG "ERROR: validation failed for $ipset_file"
      validation_failed=1
    fi
    ip netns del ipsetcheck >/dev/null 2>&1 || true
  fi
done

if [[ $validation_failed -ne 0 ]]; then
  logger -t $LOGTAG "ERROR: One or more ipset files failed validation — aborting restore!"
  echo "Validation failed — check journalctl -t $LOGTAG for details." >&2
  exit 1
fi

logger -t $LOGTAG "All ipset files validated successfully. Proceeding to apply them."

# Step 1: Set policy to accept so we do not cut off access
logger -t $LOGTAG "Setting default policy to ACCEPT"
iptables -P INPUT ACCEPT
iptables -P OUTPUT ACCEPT

# Step 2: Flush (clear) the INPUT and OUTPUT chains
logger -t $LOGTAG "Flushing INPUT, OUTPUT, and DOCKER-USER chains"
iptables -F INPUT
iptables -F OUTPUT
iptables -F DOCKER-USER

# Step 2.5: Remove all LOG rules from the FORWARD chain (since we do not flush it)
logger -t $LOGTAG "Removing LOG rules from FORWARD chain"
# We loop because each removal changes the rule numbers
while iptables -S FORWARD | grep -q -- "-j LOG"; do
  # Find the line number of the first LOG rule
  line_num=$(iptables -L FORWARD --line-numbers -n | grep LOG | head -n 1 | awk '{print $1}')
  if [[ -n "$line_num" ]]; then
    logger -t $LOGTAG "Deleting LOG rule at line $line_num in FORWARD chain"
    iptables -D FORWARD "$line_num"
  else
    break
  fi
done

# Step 3: Recreate kernel ipset configuration
logger -t $LOGTAG "Destroying all ipsets"
ipset flush 2>&1 | logger -t $LOGTAG
ipset destroy 2>&1 | logger -t $LOGTAG

logger -t $LOGTAG "Restoring ipsets from $FSIAC/ipset"
for ipset_file in $FSIAC/ipset/*; do
  if [[ -f "$ipset_file" ]]; then
    logger -t  $LOGTAG  "Restoring ipset file: $ipset_file"
    if ! ipset restore < "$ipset_file" 2>&1 | logger -t $LOGTAG; then
      logger -t $LOGTAG "WARNING: Failed to apply ipset file $ipset_file — skipping."
      continue
    fi
  fi
done

logger -t $LOGTAG "Restoring ipsets from $FSIAC/ipset/groups"
for ipset_file in $FSIAC/ipset/groups/*; do
  if [[ -f "$ipset_file" ]]; then
    logger -t  $LOGTAG  "Restoring ipset file: $ipset_file"
    if ! ipset restore < "$ipset_file" 2>&1 | logger -t $LOGTAG; then
      logger -t $LOGTAG "WARNING: Failed to apply ipset file $ipset_file — skipping."
      continue
    fi
  fi
done

logger -t  $LOGTAG  "Waiting 2 seconds for ipsets to register in kernel..."
sleep 2

# Step 4: Apply firewall rules
logger -t $LOGTAG "Applying firewall rules from $FSIAC/rules"
for file in $FSIAC/rules/*; do
  # Check if it's a regular file (not a directory, etc.)
  if [ -f "$file" ]; then
    logger -t $LOGTAG "Loading firewall rules: $file"
    source "$file"
  fi
done

# Step 5: Switch defaults back to DROP
logger -t $LOGTAG "Setting default policy to DROP"
iptables -P INPUT DROP
iptables -P OUTPUT DROP

# Step 6: Make changes persistent
if ! dpkg -s iptables-persistent &>/dev/null; then
    echo "iptables-persistent not found. Installing..."
    sudo apt update
    sudo DEBIAN_FRONTEND=noninteractive apt install -y iptables-persistent
    echo "Installation complete."
fi
echo "Making firewall rules persistent"
sudo netfilter-persistent save

# Exit cleanly
logger -t $LOGTAG "Firewall reload completed successfully"
exit 0
