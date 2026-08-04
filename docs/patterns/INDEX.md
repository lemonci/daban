# Pattern ledger (INDEX)

Single source of truth for pattern coverage across `clothing_books`. Rules (from
the design spec `docs/superpowers/specs/2026-08-03-daban-pattern-porting-design.md`):

- Every book gets a row — including "no paper patterns — excluded" rows.
- Every named, drafted block or distinctive garment gets a pattern row. Style
  variants inside a catalogue are covered by the book's row, not enumerated.
- Exclusions record the reason: no drafting content, a violated pattern-making
  principle, a duplicate, or an unusable file.
- No drafting spec (`docs/patterns/<name>.md`) without a matching row; the spec's
  source header must match its row.
- Duplicates across books: one primary source; others cross-referenced in notes.
- **Design names are accurate English, never pinyin** — `skirtblock`, not `qun`.
  The sole exception is a garment whose name is itself an English loanword
  (Qipao, Yukata, Hanfu). Translate against the book's own term.

**Coverage: complete.** All 82 distinct sources triaged 2026-08-03 — 77 PDFs,
2 archives, 1 image folder, 1 `.doc`, 1 `.xls`. (That is 84 filesystem entries:
the two archives were unpacked in place, so each counts once here but appears
twice on disk.) 45 sources were verified page-by-page; the rest were classified
from embedded outlines, PDF text layers or metadata, and every row records which.

One file was deleted on 2026-08-03 at the user's instruction:
`影响人体与服装间面积松量的力学性能.pdf`, which reported 0 pages and could not be
opened. Its topic — ease versus fabric mechanics — would be a principles source
if a readable copy is ever found.

## How to read these tables

**Status** — `merged` / `implemented` / `specified` / `candidate` / `excluded`,
per the spec. Qualifiers narrow the reason: `candidate (limited)` means only part
of the book is usable; `excluded (as pattern source)` means it has no drafts but
still earns its keep as a principles or construction reference;
`excluded (duplicate)` and `excluded (incomplete file)` mean what they say.

**Offset** — every scan paginates differently. `printed = pdf − 18` means printed
page 140 is PDF page 158. Offsets were confirmed against multiple folios spread
through each book. Two books have **non-constant** offsets and are flagged ⚠ —
re-anchor locally before citing a page.

**Basis** — how the classification was reached, weakest to strongest:
`title` (filename + metadata only) → `outline` (embedded bookmarks) →
`text` (PDF text layer) → `hash` (byte comparison) → `sampled` (pages
rasterized and read). Treat `title` rows as provisional.

⭐ marks a source of unusual value. ⚠ marks something that will bite you later.

## Patterns

One row per named, drafted block or distinctive garment. Style variants inside a
catalogue are not enumerated — the book row covers those. Page numbers are
**printed** pages; convert with the offset on the book's row.

Design names follow the project naming rule: accurate English, no pinyin, except
where the garment's name is itself a loanword in English (Qipao).

### Foundation blocks — women's

| Design | Garment | Primary source | Printed pp. | Status | Notes |
|---|---|---|---|---|---|
| `skirtblock` | Standard skirt block | 英国经典服装纸样设计基础篇 (Bray) | 140–150 | **merged** | Shipped. Straight variant (p.152) is the `silhouette` option. Spec: `skirtblock.md` |
| `bodiceblock` | Bodice block | 英国经典服装纸样设计基础篇 (Bray) | 13–35 | **merged** | ⭐ Underpins nearly everything else. Armhole is calibrated to `biceps` by the book's own draft→measure→move-UP loop (spec §D.0). Cross-check against Aldrich's fitted block below — two independent systems for the same garment is a strong verification asset. Spec: `bodiceblock.md` |
| `sleeveblock` | Straight sleeve block | 英国经典服装纸样设计基础篇 (Bray) | 92–100 | **merged** | ⭐ Drafted from biceps/shoulderToWrist/shoulderToElbow, not the armhole directly; cap arc cross-checked against the bodice's calibrated armhole (measured 22.66 mm of sleevecap ease against the book's 20–25 mm). Fitted/semi-fitted variants (弯袖) documented but not implemented (need elbow circumference, no FreeSewing measurement). Spec: `sleeveblock.md` |
| — | Dress block (连衣裙服装的基本型) | 英国经典服装纸样设计基础篇 (Bray) | 157–162 | candidate | ⭐ **Now unblocked** — Ch.12 joins the bodice and skirt blocks, both shipped. Ch.11 §7/§8 (pp.155–156) give the side-seam and waist-dart matching rules it depends on |
| — | Full-circle skirt block (全圆型裙原型) | 英国经典服装纸样设计基础篇 (Bray) | 153–154 | candidate | Radial construction, genuinely distinct from `skirtblock`. Ch.16 圆裙纸样 (pp.189–198) is the fuller treatment of the same geometry |
| — | Supplementary skirt block (附加裙原型) | 英国经典服装纸样设计基础篇 (Bray) | 151 | candidate | Assess against `skirtblock` — may fold in as an option rather than a design |

#### Bray 基础篇 — full chapter map (TOC read 2026-08-04)

Printed = PDF(1-based) − 18 throughout. Ports so far have used Ch.2, Ch.7 and
Ch.11 §3; this map is so future sessions can pick without re-reading the TOC.

| Ch. | Title | pp. | Portability |
|---|---|---|---|
| 1 | 人体测量与原型纸样 | 1 | Reference — **表1-2 主要控制尺寸及比例表 on p.12** grades B/H/W/LW/XB/CH/SH/TA/O点/后领宽/袖窿深/后窿门宽/省道/袖窿 across 10 sizes. Settles several open ambiguities; see `bodiceblock.md` §14 |
| 2 | 衣片原型 | 13 | ✅ `bodiceblock` |
| 3 | 衣片原型的使用 | 36 | Manipulation techniques (腋下省 p.41, 中心肩缝 p.47, 增大围度 p.45) — options/variants on `bodiceblock`, not new designs |
| 4 | 简单纸样设计 | 51 | Symbols + worked style examples |
| 5 | 育克设计 | 65 | Yoke designs — candidate, derives from `bodiceblock` |
| 6 | 省道转移 | 78 | Dart manipulation theory — belongs in `pattern-making-principles`, not a design |
| 7 | 袖子 | 92 | ✅ `sleeveblock` |
| 8 | 袖子的款式变化及样板设计 | 101 | Sleeve style variants — candidates once `sleeveblock` is settled |
| 9 | 衣领的基本原理 | 112 | ⭐ Collar fundamentals + 基础领型 p.116 — a genuine new block family |
| 10 | 翻领、驳领、披肩领 | 124 | Turn-down / lapel / cape collars — derives from Ch.9 |
| 11 | 裙子 | 140 | ✅ `skirtblock` (§3 p.145); §4 附加 p.151, §5 直裙 p.152, §6 全圆型 p.153, §7/§8 bodice↔skirt matching pp.155–156 |
| 12 | 连衣裙服装的基本型 | 157 | ⭐ Dress block — now unblocked by Ch.2 + Ch.11 |
| 13 | 裙子纸样的设计 | 163 | 分片裙/多片裙 — panelled skirts, candidates |
| 14 | 裙子的宽松度 | 173 | 裙裥/折叠/碎褶 — fullness treatments, options rather than designs |
| 15 | 喇叭形裙子 | 183 | Flared skirt, 标准法(裁切法) slash-and-spread — candidate |
| 16 | 圆裙纸样 | 189 | Circle skirt, 画样法 — candidate, same geometry as Ch.11 §6 |
| 附录 | 简单衣片原型 / 袖子的调整 / 款式变化 | 199 | Simplified block + sleeve adjustments |

### Foundation blocks — Aldrich system (independent second system)

*Winifred Aldrich, Metric Pattern Cutting 3rd ed. — `英国经典服装板型_11196724.pdf`, offset printed = pdf + 1.*

| Design | Garment | Printed pp. | Status | Notes |
|---|---|---|---|---|
| — | Fitted bodice block | 17–19 | candidate | Direct counterpart to Bray's bodice — ideal cross-validation |
| — | Easy-fitting bodice block | 20–21 | candidate | |
| — | Tailored jacket block | 22–23 | candidate | |
| — | Coat block | 24–25 | candidate | |
| — | One-piece sleeve block | 26–27 | candidate | |
| — | Two-piece sleeve block | 28–29 | candidate | Tailoring staple; cross-ref 熊能 vol.2 p.195 |
| — | Classic shirt block | 30–31 | candidate | |
| — | Sleeveless bodice block | 32 | candidate | |
| — | Dress block | 34 | candidate | Cross-ref Bray p.157+ |
| — | Custom/individual block | 35–48 | candidate | Drafted from one person's measurements — closest in spirit to FreeSewing's model |
| — | Trouser block | 75–90 | candidate | ⭐ No trouser block ported yet; this is the cleanest source |
| — | Close-fitting stretch block | 159–166 | candidate | Negative ease; needs a stretch-factor option |
| — | Loose-fit knit block | 167–176 | candidate | |

### Foundation blocks — 原型法 proportional system (independent third system)

*熊能 Vol. 1 — `世界经典服装设计与纸样基础原理篇(上).pdf`, offset printed = pdf − 14.
Design spec: `docs/superpowers/specs/2026-08-03-proportional-block-measurement-driven-corrections.md`.*

| Design | Garment | Printed pp. | Status | Notes |
|---|---|---|---|---|
| — | Women's bodice block (原型) | 108–120 | candidate · specified | ⭐ Two inputs only (B, 背长). The spec adds measurement-driven Ch.9 corrections on top |
| — | Women's sleeve block | 111–113 | candidate | Drafted from the finished armhole — depends on the corrected bodice |
| — | Body-type corrections, bodice | 168–180 | candidate | Six types: 挺胸/驼背/瘦/胖/平肩/溜肩. Slash-and-pivot; amount left to the wearer, which is what the spec computes |
| — | Body-type corrections, sleeve | 181–183 | candidate | Cap height insufficient / excessive |
| — | Body-type corrections, skirt | 184–188 | candidate | 腹凸体, 翘臀体 — folds into the shipped `skirtblock`, not a new design |
| — | Men's bodice block | 121–123 | candidate | ⚠ Different formula family (`B/6+8.5`, `B/12`) — a separate design, never an option on the women's block. Book states there is no men's sleeve or trouser block |
| — | Women's trouser block | 116–120 | candidate | Cross-ref Aldrich pp.75–90 |

### Skirts, trousers, culottes

| Design | Garment | Primary source | Printed pp. | Status | Notes |
|---|---|---|---|---|---|
| — | Six-panel skirt | 中等职业学校…原型裁剪 (李鸥华) | 56 | candidate | |
| — | Flared skirt | 中等职业学校…原型裁剪 (李鸥华) | 62 | candidate | Cross-ref 熊能 vol.3 pp.39–42 (small/medium/large flare) |
| — | A-line skirt | 世界经典…女装篇 上集 (熊能) | 34 | candidate | |
| — | Eight-panel flared skirt | 世界经典…女装篇 上集 (熊能) | 44 | candidate | |
| — | Box-pleat / inverted-pleat skirt | 世界经典…女装篇 上集 (熊能) | 46–48 | candidate | |
| — | Accordion-pleat skirt | 世界经典…女装篇 上集 (熊能) | 50–52 | candidate | Straight and A-line forms |
| — | Spiral skirt | 世界经典…女装篇 上集 (熊能) | 56 | candidate | Unusual construction; good showcase piece |
| — | Women's trouser block | 世界经典…女装篇 上集 (熊能) | 66–71 | candidate | Includes back-crotch-drop principle, seam allowance and lay plan |
| — | Jeans | 世界经典…女装篇 上集 (熊能) | 80–82 | candidate | Standard and low-rise |
| — | Culottes | 世界经典…女装篇 上集 (熊能) | 106–116 | candidate | 8 variants |
| — | Men's tapered trousers | 原型服装裁与制作 | 122 | candidate | |

### Sleeves

| Design | Garment | Primary source | Printed pp. | Status | Notes |
|---|---|---|---|---|---|
| — | Raglan sleeve | 英国经典服装纸样设计提高篇 (Bray) | 57–70 | candidate | Cross-ref 李鸥华 p.107 |
| — | Kimono / dolman sleeve block | 英国经典服装纸样设计提高篇 (Bray) | 17–56 | candidate | Two chapters: block then applications |
| — | Drop-shoulder cutting | 英国经典服装纸样设计提高篇 (Bray) | 71–80 | candidate | |
| — | Sleeve–armhole relationship | 英国经典服装纸样设计提高篇 (Bray) | 81–92 | candidate · principles | Feed to the principles skill as well as any design |
| — | Gusseted kimono sleeve | 世界经典…基础原理篇 下集 (熊能) | ~240 | candidate | 11-step construction |
| — | Tailored sleeve with elbow dart | 世界经典…基础原理篇 下集 (熊能) | 195 | candidate | |

### Collars

*Primary source for the whole group: 最新时装配领技术 (2nd ed.), offset printed = pdf − 11.*

| Design | Garment | Printed pp. | Status | Notes |
|---|---|---|---|---|
| — | Stand collar | 68–94 | candidate | 6 named variants incl. self-drafted/integral |
| — | Notched lapel collar | 10–41 | candidate | 8 variants; cross-ref 熊能 vol.2 pp.90–99 |
| — | Closed turn-down collar | 42–67 | candidate | U-shape, V-shape, stand-and-fall, low-stand |
| — | Collarless necklines | 95–111 | candidate | Cross-ref 熊能 vol.2 pp.3–13 (8 geometric neckline types) |
| — | Cowl / draped collar | 64 | candidate | |
| — | Chinese stand collar | 世界经典…基础原理篇 下集, 26–33 | candidate | 中式日常/礼服/侧开襟/缺口立领 — pairs with the Qipao work |
| — | Shawl collar | 最新西服款式…手册, 357–364 | candidate | ⚠ Re-anchor that book's offset per Part |

### Chinese garments (flagship group)

| Design | Garment | Primary source | Printed pp. | Status | Notes |
|---|---|---|---|---|---|
| `qipao` | Qipao / cheongsam | 唐装旗袍款式与制作 | 63–172 | candidate | ⭐ **Flagship.** ~110 numbered drafts, each with formulas **and** a finished-spec table. Keeps its transliterated name per the naming rule. Cross-ref 熊能 下集 pp.543–567; 韩滨颖 p.78; 原型服装裁与制作 pp.66–68 |
| — | Tang jacket | 唐装旗袍款式与制作 | 64–171 | candidate | Jacket + skirt and jacket + trouser sets throughout the catalogue |
| — | Chinese-Western hybrid blouse | 世界经典…女装篇 下集 (熊能) | 556 | candidate | 中西式斜开襟罩衫 — diagonal front opening |
| — | Mao jacket | 最新合体服装工艺 | 135–142 | candidate (limited) | 中山装 — construction only in that book; needs a drafting source |

### Childrenswear

*Primary source: Aldrich, Metric Pattern Cutting for Children's Wear — offset printed = pdf − 5.*

| Design | Garment | Printed pp. | Status | Notes |
|---|---|---|---|---|
| — | Children's bodice block | ~20–50 | candidate | With mm-level grading across height bands 92–170 cm |
| — | Children's kimono block | ~50 | candidate | |
| — | Children's raglan-sleeve block | ~50 | candidate | |
| — | Children's trouser block | ~200 | candidate | Grading tables at ~240 |
| — | Childrenswear block (Bray) | 英国经典…提高篇, 212–234 | candidate | Second system for cross-checking |
| — | Baby/toddler bodice + sleeve block | 图解童装纸样设计 服装篇, 20–24 | candidate | Spec-table style; lower-resolution scan |

### Menswear

| Design | Garment | Primary source | Printed pp. | Status | Notes |
|---|---|---|---|---|---|
| — | Men's bodice block | 原型服装裁与制作 | 110–113 | candidate | |
| — | Men's suit jacket | 最新西服款式…手册 | 684–702 | candidate | ⚠ Re-anchor offset per Part |
| — | Men's vest | 最新西服款式…手册 | 748–754 | candidate | |
| — | Men's shirt | 原型服装裁与制作 | 115+ | candidate | |

### Hats

*Primary source: 时装帽设计与制作800例 — offset printed = pdf − 29. All drafted from head circumference (HS).*

| Design | Garment | Printed pp. | Status | Notes |
|---|---|---|---|---|
| — | Two-piece hat | 164–165 | candidate | `HS/12+1`, `HS/4`, `HS/3−0.5`; maps to FreeSewing `headCircumference` |
| — | Six-piece hat | 166–167 | candidate | |
| — | Round-top hat | 168 | candidate | |
| — | Hood | 169–171 | candidate | Cross-ref 熊能 vol.2 (seamed / integrated / detachable hoods) and 高国利 p.70 |

### Underwear, swimwear, formalwear

| Design | Garment | Primary source | Printed pp. | Status | Notes |
|---|---|---|---|---|---|
| — | Knickers / briefs | 英国经典服装纸样设计提高篇 (Bray) | 137–154 | candidate | |
| — | Slip | 英国经典服装纸样设计提高篇 (Bray) | 113–136 | candidate | Cross-ref 熊能 下集 pp.470–485 |
| — | Bra | 世界经典…女装篇 下集 (熊能) | 398–411 | candidate | Complex; defer until blocks are established |
| — | Swimwear | 世界经典…女装篇 下集 (熊能) | 423–449 | candidate | Needs the stretch/negative-ease treatment |
| — | Corset / shapewear | 世界经典…女装篇 下集 (熊能) | 388–397 | candidate | |
| — | Bridal / formal gown | 世界经典…女装篇 下集 (熊能) | 509–542 | candidate | |

## Books

Every source in `clothing_books`, grouped by what it actually is.

### Drafting textbooks — the foundation systems

| File | Pages | Offset | Status | Basis | Notes |
|---|---|---|---|---|---|
| 英国经典服装纸样设计基础篇.pdf | 266 | printed = pdf − 18 | in progress | **full TOC read** | **Natalie Bray**, 国际服装丛书, 中国纺织出版社. All three primary blocks now shipped (`skirtblock`, `bodiceblock`, `sleeveblock`). Full chapter map below |
| 英国经典服装纸样设计提高篇.pdf | 309 | printed = pdf − 9 | candidate | sampled | Bray **advanced** volume (国际服装丛书③, 译 刘驰/袁燕, 西北纺织工学院). Builds on the basics volume: panelled/princess block, kimono & raglan sleeves, drop shoulder, drape, underwear, tailoring, childrenswear block |
| 英国经典服装板型_11196724.pdf | 190 | printed = pdf **+ 1** | candidate | sampled | ⭐ **Winifred Aldrich, *Metric Pattern Cutting* 3rd ed.**, 国际服装丛书⑯, 译 刘莉, 中国纺织出版社 2003, ISBN 7-5064-2338-3 (licensed from Blackwell). The generic Chinese title hides a major English-language classic. Gives a *second* complete British block system alongside Bray — incl. fitted/loose/jacket/coat/shirt/sleeveless/dress bodice blocks and stretch-fabric blocks |
| 世界2011.现代工业化成衣制板-高国利.pdf | 154 | printed = pdf − 1 | candidate | sampled | 现代成衣制板, 高国利、吴继辉, 辽宁美术出版社. Compact modern RTW course: block → sleeves → collars → torso → skirt/trouser blocks → applications → knits → industrial patterns. Filename prefix "世界2011" is a catalogue tag, not the title |
| 世界经典服装设计与纸样__三__女装篇__（上集）(1).pdf | 321 | printed = pdf − 17 | candidate | sampled | ⭐ 熊能, 江西美术出版社 2007, ISBN 978-7-80749-232-0; 序 by 张文斌 (东华大学). Vol. 3 of an 8-volume set. The densest drafting data in the collection — ~90 fully-worked women's garments (20 skirts, 19 trousers, 8 culottes, 19 blouses, dresses, ~20 jackets, 8 vests), each with formulas, seam allowance and lay plan |
| 世界经典服装设计与纸样基础原理篇(上).pdf | 217 | printed = pdf − 14 (front matter − 2) | candidate | sampled | ⭐⭐ **Vol. 1 — the foundation volume of the set.** 熊能, 江西美术出版社, 序 by 张文斌 (东华大学) 2007-09, which states the whole 8-volume set is built on 原型法 because that method "is not systematically taught in China". Ch.6 women's block pp.108–120 and men's block pp.121–123; Ch.7 pp.124–139 is a **muslin-fitting chapter** that empirically re-derives the dart amounts from toiles rather than asserting them; Ch.8 dart theory pp.140–166; Ch.9 block correction for 6 body types pp.167–194; Ch.4 pp.44–92 tabulates **five national sizing systems** (GB1335-91, JIS, US, UK, German). ⚠ The block takes only **two** inputs — B and 背长 — everything else proportional. Offset constant over 8 checkpoints. Bookmarks map 1:1 to PDF pages |
| 世界经典服装设计与纸样__2__基础原理篇__下集(1).pdf | 304 | printed = pdf − 18 | candidate | sampled | 熊能 Vol. 2 — a *components* volume: 8 collarless necklines, 30+ collars (incl. 中式立领 Chinese stand collars), set-in and kimono sleeves by garment class, and hoods. No whole-garment blocks. Its companion Vol. 1 (基础原理篇 上集), which holds the foundation bodice block, is the row above |
| 唐装旗袍款式与制作.pdf | 173 | printed = pdf **+ 1** | candidate | sampled | ⭐ **The Qipao/Tang-suit source.** 110–111 numbered garments: a photo section, then one 裁剪图 per garment, each carrying drafting formulas (`B/4`, `W/4+2.5`, `0.15B+4.5`, `N/2`, `S/2`) **and** a 成品规格 finished-spec table in cm. Styles supplied by 沈阳市旗袍厂, 编后记 dated 2004-01-05. ⚠ No publisher or ISBN anywhere in the scan. Drafted directly from B/W/H/N/S — no foundation block |

**Series note.** `世界经典服装设计与纸样` is an 8-volume set by 熊能 (江西美术出版社): Vols 1–2 基础原理篇 (上/下), 3–4 女装篇 (上/下), 5 男装篇, 6 童装篇, 7 针织篇, 8 工业篇. The collection holds **Vols 1–4** (Vol. 1 added 2026-08-03 after the first scan). The 女装篇 pair is complete: the file named `…女装篇（上集）` proved to be a second scan of Vol. 3, and `…女装篇（下集）` is the genuine Vol. 4. Still missing: Vol. 5 男装篇, Vol. 6 童装篇, Vol. 7 针织篇, Vol. 8 工业篇. With Vol. 1 present the set is self-sufficient for women's wear — blocks, components and garments all from one consistent 原型法 system.

### Drafting textbooks — Chinese course books

| File | Pages | Offset | Status | Basis | Notes |
|---|---|---|---|---|---|
| 中等职业学校教育部规划教材-服装类专业含岗位培训原型裁剪.pdf | 254 | printed = pdf − 5 | candidate | sampled | 李鸥华 主编, 高等教育出版社 1998, ISBN 7-04-006509-6. **Primary** of a duplicate pair. Full 原型 course: block → dart rotation → skirts → trousers → sleeves → collars → 6 worked garments. Crisp; faint QQ watermark |
| 原型裁剪_李鸥华.pdf | 253 | printed = pdf − 5 | excluded (duplicate) | sampled | Same book, same ISBN, pixel-identical on every page checked. Differs only in filename and a 1-page count discrepancy. Cross-ref of the row above |
| 原型服装裁与制作.pdf | 263 | printed = pdf − 3 | candidate | sampled | Broadest scope in the collection: women's + men's + children's blocks, dart manipulation (rotate / cut-and-fold), fit-defect correction, grading. Formulas like `H/4−1`, `AH/3−1~2` legible. ⚠ No title/colophon page in the scan — author and publisher unknown |
| 现代服装纸样设计_韩滨颖.pdf | 195 | printed = pdf − 8 | candidate | sampled | 韩滨颖、李桂荣、高岩, 中国纺织出版社, 前言 dated 2001-05. 40 prototype-method designs + 20 proportional-block designs. ⚠ Front-matter leaves are shuffled in this scan (offset is 6 near printed p.1–5, 8 everywhere else) — verify folios for lookups before printed p.6 |
| 最新服装出样技术_吴经熊.pdf | 199 | printed = pdf − 4 | candidate | sampled | 吴经熊, 上海科学技术出版社 1998, ISBN 7-5323-4693-5. Collar theory (pp.34–76) + sleeve theory (pp.77–107) + numbered style catalogue, each entry with 规格/用料/特点/要求 and a dimensioned draft |
| 最新时装配领技术.（第二版）.pdf | 288 | printed = pdf − 11 | candidate | sampled | 吴经熊、吴颖, 上海科学技术出版社, 2nd ed. (1st ed. 1990, 100k+ copies). **The collar source** — a complete taxonomy with its own collar-base-point formula `a − (a/2 − a²/2b)` (p.133), plus a comparison of draping vs 文化式/登丽美式 flat methods (pp.112–141). Companion to the row above by the same lead author |

### Drafting textbooks — specialist and large-scope

| File | Pages | Offset | Status | Basis | Notes |
|---|---|---|---|---|---|
| 世界经典服装设计与纸样__女装篇__（下集）(1).pdf | 294 | printed = pdf **+ 277** | candidate | sampled | ⭐ 熊能, 江西美术出版社 2007 — the **下集** completing the women's-wear volume. Chs 9–20: casual, coats, jackets, shapewear, bras, underwear, swimwear, loungewear, slips, lingerie, formalwear, and **中式服装 incl. 旗袍 (pp.543–567)**. Ends with a 女装原型 appendix (bodice p.568, skirt p.569) — the block the whole two-volume set drafts from |
| 世界经典服装设计与纸样__女装篇__（上集）(1).pdf | 312 | — | excluded (duplicate) | sampled | Same volume as the 321-page `…三…女装篇（上集）` file — identical CIP/ISBN/author/publisher and a near page-for-page identical TOC. Not byte-identical (different scan) |
| 最新西服款式设计、制版与缝制工艺实用手册.pdf | 1538 | ⚠ **drifts 16 → 7** | candidate | sampled | 主编 王达维, 黑龙江人民出版社 2005, ISBN 7-207-66688-8 — a merged 3-volume boxed set. Tailoring formulas throughout (`B/10+7.5`, `袖肥=B/5−0.5`, `袖口大=B/10+4.5`), men's and women's suits, vests, trousers, plus posture-correction drafting (溜肩/驼背/含胸…). ⚠ The offset steps down at each 篇 boundary — **re-anchor per Part**, never use one constant |
| 中国衣形结构.pdf | 287 | printed = pdf − 3 (− 4 after ~p.190) | candidate · **principles source** | sampled | 王益正, 安徽科学技术出版社. College-level theory: surveys and critiques **six** rival drafting systems (定寸法, 经验公式法, D式法, 原型法, 母型法, 基样法) before presenting the author's own 衣型法. Derives collar and cap arcs from circle geometry with π. Directly relevant to the methodology comparison — see the draping section. Tiled 锐度服装技术 watermark, non-obscuring |
| 童装、婴儿装纸样设计：0～14岁.pdf | 259 | printed = pdf − 5 | candidate | sampled | ⭐ **Winifred Aldrich, *Metric Pattern Cutting for Children's Wear and Babywear* 3rd ed.** (© 1999 Blackwell), 译 姜蕾, 中国纺织出版社 2001, ISBN 7-5064-2069-4, 国际服装丛书⑥. The best childrenswear source: point-to-point drafting **plus mm-level grading tables across height bands 92–170 cm** — directly usable for FreeSewing's measurement-driven model. Offset verified at 5 points, the most consistent in the collection |
| 图解童装纸样设计 服装篇.pdf | 134 | printed = pdf − 5 | candidate | sampled | 冉玛、王雪珂 主编, 化学工业出版社 2010, ISBN 978-7-122-08401-9. Childrenswear via **numeric spec tables** per size code rather than symbolic formulas; bodice and sleeve blocks at pp.20–24. ⚠ Source images are low-resolution (459×678 px) — small dimensions are soft; prefer the Aldrich row above where they overlap |
| 世界服装大师代表作及制作精华_刘瑞璞.pdf | 86 | printed = pdf − 1 | candidate (limited) | sampled | 刘瑞璞, 江西科学技术出版社 1998. Designer-profile album (Balenciaga, Givenchy, Chanel, Dior, YSL, Cardin, Fortuny, Schiaparelli). Mostly photography and prose, but **some iconic pieces carry real measured drafts** — e.g. Balenciaga's 1953 ivory silk coat, pp.~17–19. Cherry-pick only |
| 现代成衣制板-高国利.pdf | 139 | — | excluded (duplicate) | sampled | Same book as `世界2011.现代工业化成衣制板-高国利.pdf` — that file's cover in fact reads 现代成衣制板. Identical authors, publisher, series and chapter-by-chapter TOC with identical page numbers. This copy is 220 MB for 15 fewer pages; prefer the 7 MB one |
| 最新合体服装工艺.pdf | 268 | printed = pdf − 5 | excluded (as pattern source) | sampled | 戴龙泉, 上海科学技术出版社 1998, ISBN 7-5323-4694-3. 工艺 means construction: shoulder/collar/sleeve **assembly** technique, 8 worked sewing examples, Mao-jacket collar build-up. Only one real drafting diagram found (女裤 side fly, p.87). **Construction reference**, not a drafting source |
| 职业装设计艺术_11294455.pdf | 100 | printed = pdf − 1 | excluded | sampled | Design-theory and marketing essay on workwear (classification, CI branding, market trends) with fashion photography. **Zero** pattern pieces or dimensions across 11 pages sampled through the whole book. No colophon — author/publisher unknown |

### Style libraries and catalogues

The `…800例` books share a format: a large gallery of fashion illustrations, of
which only entries marked **★** carry a cross-reference to a dimensioned draft in a
short technical section at the back. The illustrations themselves are not
redraftable. Judge these by the size of that technical section, not the page count.

| File | Pages | Offset | Status | Basis | Notes |
|---|---|---|---|---|---|
| 休闲女装款式裁剪图册_刘琳.pdf | 143 | printed = pdf − 21 | candidate | sampled | ⭐ **The exception — every style is redraftable.** ~118 casual-womenswear entries, each with a 成品规格 finished-spec table *and* a full formula draft (`胸1/4`, `胸1.5/10+4.5`). A 制图说明 page (p.1) states the 比例裁剪法 proportional method, so any size can be drafted. Direct drafting, no 原型. Publisher not legible |
| 休闲女装设计与制板_刘影.pdf | 170 | printed = pdf − 6 | candidate (part 2 only) | sampled | 刘影, preface dated 1999-11. Part 1 (pp.1–95) is series-design silhouettes and illustration technique — no numbers. **Part 2 (pp.97–161) is real**: a 号型规格表 (160/84) plus block formulas (`1/10胸围+4`, `1/4胸围`) and dimensioned style variations |
| 休闲装设计与制作800例_杜冰冰.pdf | 212 | printed = pdf − 27 | candidate (limited) | sampled | ★ entries only — roughly 1 in 20–30. Those do resolve to genuine drafts (`W/4+4`, `H/4+1.5`, AH-based sleeves) in the back section around pp.152–153. No size table on the diagram pages; the maker supplies W/H/AH. No TOC |
| 运动装设计与制作800例_陈昕罡.pdf | 210 | printed = pdf − 27 | candidate (limited) | sampled | 陈昕罡; same series and ★ convention as the row above. Sportswear by discipline (track, soccer, tennis). Dimensioned drafts around pp.149–150, 157. Front colour-plate insert is unpaginated with its own style numbering |
| 时装帽设计与制作800例.pdf | 216 | printed = pdf − 29 | candidate (limited) | sampled | 吴卫刚, preface 2000-10. ~800 hat illustrations with **no** ★ system, but pp.164–171 give **4 genuinely drafted hat blocks** — 双片帽, 六片帽, 圆顶帽, 连衣帽 — built on head circumference (`HS/12+1`, `HS/4`, `HS/3−0.5`). Appendix 1 (p.172) reprints national standard **FZ 82002-92** sizing hats 46–61 cm. Those 4 blocks are the whole value here, and they map cleanly onto FreeSewing's `headCircumference` |
| 时装帽设计与制作800例(1).pdf | 216 | — | excluded (duplicate) | hash | **Byte-identical** to the row above (MD5 `0EDCF2423BFE…`, 5,744,565 bytes) |
| 修身时髦OL小西装（制版图 款式图）.pdf | 1 | n/a | candidate (single style) | text | A **single magazine page** — 上海服饰 (shanghai-style.com), 服装沙龙 column, printed p.137. Carries a complete parameter set for one fitted OL blazer: `B = B*+(放松量+内衣厚) = 84+9 = 93`, `B−W = 15`, `H−B = 7`, `N = 39`, 衣长 50, 袖长 24 cm, with 2 cm round shoulder pads, front surplus rotated into a neckline pleat and back surplus eased into the armhole, waistline raised 1.5 cm. Self-contained enough to draft from, but one style only |
| 职业装设计与制作800例_张正学.pdf | 101 | printed = pdf − 0 | excluded (incomplete file) | sampled | ⚠ **Truncated scan.** Its own TOC promises chapters to p.158 and a 裁剪图 section at p.159; the file stops at p.101, mid-chapter. Every page present is illustration-only, and the ★ cross-references (e.g. "★206 裁剪图见P178") point outside the file. Not assessable as supplied — would need a complete copy |

### Knitwear

Knit drafting differs from woven in one decisive way: **ease can go negative**.
These two books supply the rules, which the woven textbooks never state.

| File | Pages | Offset | Status | Basis | Notes |
|---|---|---|---|---|---|
| 针织服装结构设计_12609628.pdf | 202 | printed = pdf − 11 | candidate · **principles source** | sampled | ⭐ 谢梅娣、赵俐, 中国纺织出版社, "十一五" textbook series, 前言 2010-03. Cover reads *KNITWEAR PATTERN MAKING*. Universal knit bodice block (men's and women's) at pp.69–71 with `BL = 2B/10+4`, `背宽 = 1.5B/10+4`, `后领宽 = N/5−0.3`. **Table 4-2-1 (p.70) gives bust ease by tightness class: 弹性紧身型 −10…0 cm, 贴体型 0…5, 合体型 0…10, 宽松型 ≥10** — the negative-ease rule in usable form. Also: cap ease → 0 or negative for knits (p.137), and GB/T 6411-2008 fabric stretch classes A/B/C. Born-digital quality |
| 针织服装设计基础.pdf | 264 | printed = pdf − 2 | candidate (chs. 7–9) | sampled | 桂继烈 (compiler) with 刘艳君/陈欣/毛莉莉, 前言 2000-06; publisher not in the scan. Chs. 1–6 are generic design theory — skip. **Chs. 7–9 (pp.106–260) are knit-specific**: qualitative negative-ease rule (p.116), 7 named crotch-gusset shapes (p.117), the 负样板 complement-pattern technique, and a **shrinkage-compensated pattern formula** `衣长样板 = (成品规格 + 挽边宽 + 缝耗) ÷ (1 − 回缩率)` (p.147) |
| 针织装设计与制作800例_李佳红.pdf | 33 | — | excluded (incomplete file) | sampled | ⚠ **Fragment** — 33 pages of a 160+ page book. Sketch look-book only, no drafting; one page corrupted |

### Extracts and proceedings

| File | Pages | Offset | Status | Basis | Notes |
|---|---|---|---|---|---|
| 婴儿装纸样设计.pdf | 10 | per-page folio (non-sequential) | candidate (limited) | sampled | ⚠ Not a book — a **10-page curated extract** whose running header reads 童装纸样设计, watermarked from an ebook-sharing site. Pages are out of order (folios 68,75,79,71,80,88,69,78,84,72) so there is no offset; read each folio. Content is genuine: baby rompers, dresses, bib, newborn bonnet (`0.9 × 头围/2`), and a children's block reference chart (height 80–150 cm). Likely extracted from the fuller Aldrich childrenswear volume already listed — prefer that |
| 首届北京国际服装基础理论研讨会文集.pdf | 240 | printed = pdf − 16 | excluded (as pattern source) · narrow principles source | sampled | 中国服装研究设计中心 & 《中国服装》杂志社, 轻工业出版社, 1990-10, ISBN 7-5019-0926-1. 37 papers selected from 142. ⚠ **Lower value than its size suggests** — the volume is themed almost entirely on 民族化 vs 时代感 (cultural identity in design), not garment engineering. Only **3 of 40** items are structurally relevant: 三吉满智子 (Bunka Women's Univ.) on a body-conformity typology of garment construction (pp.7–22); Francesann Heisey on computational fabric draping with real governing equations (pp.30–32); 刘一铭 on East–West "garment space" — 3-D fitted vs planar cut (pp.141–173). Printed in traditional characters |

### Research papers and theory articles

None of these contain paper patterns. Several are principles sources — they feed
the `pattern-making-principles` skill rather than a design.

| File | Pages | Status | Basis | Notes |
|---|---|---|---|---|
| 衣身平衡与胸省变化的关系.pdf | 5 | excluded (as pattern source) | text | **Principles source** — front/back balance, bust-dart reservation. Already mined |
| 袖山_袖型_袖窿之间的关系探讨.pdf | 3 | excluded (as pattern source) | text | **Principles source** — cap height limits. Already mined |
| 袖窿深_袖山高与袖子张角之间关系的初步探讨.pdf | 1 | excluded (as pattern source) | text | **Principles source** — sleeve pitch angle formula. Already mined |
| 原型袖窿结构的设计.pdf | 4 | excluded (as pattern source) | text | Principles candidate — armhole block from body movement ranges |
| 袖山结构模型和结构设计方法的探讨.pdf | 5 | excluded (as pattern source) | text | Principles candidate — cap/armhole mathematical model, ease (吃势) |
| 袖山与袖窿对位点的研究_兼论衣袖与衣身的....pdf | 4 | excluded (as pattern source) | text | Principles candidate — cap/armhole notch matching |
| 袖深与袖肥的确定.pdf | 2 | excluded (as pattern source) | text | Principles candidate — cap depth vs sleeve width, JP block method |
| 衣袖结构数学模型建立与几何参数推导.pdf | 2 | excluded (as pattern source) | text | Principles candidate — sleeve geometry; fit-class angle ranges |
| 西装袖作图法研究.pdf | 6 | excluded (as pattern source) | text | Principles candidate — two-piece suit sleeve, armhole/cap ease table |
| 胸围_臂根围与袖窿深相关关系的比较.pdf | 2 | excluded (as pattern source) | text | Principles candidate — which drafting formulas are truly linear in bust |
| 小仓万寿男的袖子研究.pdf | 12 | excluded (as pattern source) | text | Principles candidate — Ogura Masuo on sleeve twist/hang. Machine-translated JP, rough |
| 袖子的立体裁剪方法.pdf | 3 | excluded (as pattern source) | text | Draping method for sleeves, not a draft |
| 双圆弧在服装纸样设计中的应用[1].pdf | 3 | excluded (as pattern source) | text | Principles candidate — biarc curve construction; relevant to how curves are drawn |
| 窄衣基型与立体性裁剪技术的完善.pdf | 6 | excluded (as pattern source) | text | Theory — evolution of the Western fitted (narrow) base type |
| 衣片放码方法综述_.pdf | 5 | excluded (as pattern source) | text | Grading methods survey. ⚠ Sampled page carried an unrelated membrane-filtration article — verify the file actually holds the named paper before use |
| 三维人体扫描仪测量数据与手工测量数据关系研究.pdf | 4 | excluded (as pattern source) | text | Body-scan vs hand measurement regressions; sizing reference only |
| 三维人体测量技术的原理及应用.pdf | 5 | excluded (as pattern source) | text | 3D body measurement survey |
| 三维身体测量及合身裁剪服装.pdf | 6 | excluded (as pattern source) | text | 3D measurement + made-to-measure; OCR of this scan is largely unreadable |
| 丝织物归缩量研究.pdf | 3 | excluded (as pattern source) | text | Silk fabric shrinkage; materials, not patterns |
| 孕妇腹部变化.pdf | 19 | excluded (as pattern source) | title | Maternity abdomen change study — principles candidate if maternity blocks are ever added |
| 一种动态的多维的人体解剖模型.pdf | 1 | excluded | text | Medical anatomy paper, unrelated to garments — appears misfiled in this collection |
| 影响人体与服装间面积松量的力学性能.pdf | 0 | excluded | text | ⚠ **File reports 0 pages** — corrupt or unreadable. Topic (ease vs fabric mechanics) would be a principles source if a good copy is found |
| 首届北京国际服装基础理论研讨会文集.pdf | 240 | excluded (as pattern source) | title | Conference proceedings, 1st Beijing intl. symposium on garment theory. Large principles seam — worth a dedicated mining pass, not a design |

### History, culture and design theory

| File | Pages | Status | Basis | Notes |
|---|---|---|---|---|
| 中国现代服装史.pdf | 112 | excluded (as pattern source) | outline | Modern Chinese dress history. Ch.6 旗袍的发展 is useful **context** for the planned Qipao design |
| 中国历代服装资料-张书光.扫描版.pdf | 214 | excluded (as pattern source) | outline | Historical costume plates; illustrations, no drafts |
| 唐代妇女的服装与化妆.pdf | 29 | excluded (as pattern source) | title | Tang-dynasty women's dress and make-up; historical |
| 现代服装设计文化学.pdf | 160 | excluded (as pattern source) | text | Design-culture theory. Scan is watermarked with a reseller's ad pages |
| 色彩学.pdf | 35 | excluded | text | Colour theory; no garment content |
| 外贸服装知识大全.pdf | 94 | excluded (as pattern source) | text | Garment export/trade glossary and industry notes |
| 新风暴米兰巴黎2009春夏男装周.pdf | 40 | excluded (as pattern source) | title | Runway photography, SS2009 menswear |
| 一本纯粹的设计师手稿.pdf | 98 | excluded (as pattern source) | title | Designer sketchbook — croquis, no drafting |
| 一本纯粹设计师手稿.pdf | 96 | excluded (as pattern source) | outline | Near-duplicate of the above — *not* byte-identical (98 vs 96 pages, 8.6 vs 32.9 MB), so two different scans of the same title. Watermarked 服装资源网 |

### Sewing construction and technique

| File | Pages | Status | Basis | Notes |
|---|---|---|---|---|
| 图解服装缝制手册-康妮.阿玛登.克兰福德.扫描版.pdf | 394 | excluded (as pattern source) | title | Illustrated sewing manual (Connie Amaden-Crawford). **Construction reference** for seam/dart technique. Primary of the pair below |
| 图解服装缝制手册.pdf | 394 | excluded (duplicate) | hash | **Byte-identical** to the row above (MD5 `AC1FFD81D2DF…`, 45,276,465 bytes) |

### Draping and alternative methodologies (立体裁剪)

Three distinct methods sit under the 立体裁剪 label, and conflating them would be a
mistake:

1. **True draping on a stand** — the Italian book. Pin cloth to the form, mark,
   trim, true, flatten. Organised by silhouette; no block exists.
2. **Flat-pattern transformation** — Nakamichi's *Pattern Magic* series. Starts
   from an existing **Bunka sloper** and slashes/spreads/folds it flat. Despite
   the Chinese title 立体裁剪, there is little actual draping.
3. **Flat-pattern engineering of drape** — Sato's *Drape Drape*. Engineers the
   fall of fabric by pattern geometry rather than by working on the form.

All are principles sources first; a design ported from any of them still needs a
numeric draft. (User direction, 2026-08-03: the Italian method is a distinct
methodology worth folding into `pattern-making-principles`.)

| File | Pages | Status | Basis | Notes |
|---|---|---|---|---|
| 意大利立体裁剪.pdf | 200 | candidate (limited) · **priority principles source** | sampled | offset: printed = pdf − 3. **Confirmed methodologically distinct**, as the user expected. Method observed on-page: pin cloth/paper to the form on a reference line → smooth toward the side → mark → trim → true (notches A–F, grain check, curve ruler) → flatten and trace (pp.115, 150, 180). Organised by **silhouette** (直身/收腰/喇叭/公主线/三开身/四开身), never by 原型 — the word block never appears. Flattened pieces do carry cm dimensions (sleeve cap 14, elbow line 33, cuff 10, p.90), and p.90 explicitly labels one flat construction "意大利结构方法之一". Covers tops, skirts, trousers, dresses, 6 collars incl. 旗袍领, 7 sleeves, plus designer replicas (Chanel, Valentino, Givenchy) and a block-adjustment chapter (p.187). ⚠ No cover in the scan — author/publisher unknown. ⚠ Open question: how bust balance/dart is handled was not determined |
| 中道友子1立体裁剪裁.pdf | 92 | excluded (as pattern source) · methodology source | sampled | **PATTERN MAGIC パターンマジック vol. 1**, 中道友子 Nakamichi Tomoko, 文化出版局, 2nd printing 2005. Slash/spread transformation of the Bunka sloper. **Primary** of the pair below (crisper) |
| 中道友子立体裁剪裁1.pdf | 92 | excluded (duplicate) | sampled | Same title, **6th printing 2007** — a different scan of the same book, not byte-identical. Larger canvas but watermarked, and incomplete in different places than the row above. Keep as a gap-filler |
| 中道友子2合并文件.pdf | 55 | excluded (as pattern source) · methodology source | sampled | **PATTERN MAGIC vol. 2**, ISBN 978-4-579-11170-1, 文化出版局 2007. Unique — the only vol. 2 present. Mannequin shape studies **and** flat slash/spread. ⚠ Photocopier artifacts; pages 10–11 are missing from the scan |
| 中道友子立体裁剪魔法3-伸缩素.pdf | 103 | excluded (as pattern source) · methodology source | sampled | **PATTERN MAGIC 伸縮素材 (Stretch Fabric)**, 文化出版局. Carries a **negative-ease knit sloper** — the most directly reusable thing in the group, and relevant to any knit design. ⚠ Pages are in irregular, non-sequential order in this scan |
| 中道友子魔法立体裁剪3.pdf | 100 | excluded (duplicate) | sampled | Same 伸縮素材 title as the row above — no "vol. 3" is printed anywhere in either. Page order here is reliable, so prefer this copy for reading and the other for completeness |
| 悬垂褶皱-佐藤.pdf | 94 | excluded (as pattern source) · methodology source | sampled | **ドレープドレープ2 (Drape Drape 2)**, 佐藤久美子 Sato Hisako, 文化出版局 2010, ISBN 978-4-579-11308-8. Engineers drape through flat-pattern geometry rather than on the stand |
| 袖子的立体裁剪方法.pdf | 3 | excluded (as pattern source) | text | Draping method for sleeves (paper) — cross-listed under research papers |

### Reference data (sizing tables and standards)

| File | Kind | Status | Basis | Notes |
|---|---|---|---|---|
| 中小学学生服成品规格.pdf | 32-page standard | excluded (as pattern source) | text | SZJG 15—2006 school-uniform **finished-garment** specs, tables 1–13. Sizing reference only; finished specs ≠ body measurements |
| 总尺寸表.xls | 27-sheet workbook | excluded (as pattern source) | sampled | Factory spec workbook — finished 衣长/胸围/etc. per knit style (女单衣, 男单T, 小童二件套 …). Production specs, not drafting |
| 中国童装尺码大全.doc | Word doc | excluded (as pattern source) | title | Chinese childrenswear size compendium. Legacy `.doc`; would need conversion to read |

### Archives and non-book files

| File | Kind | Status | Basis | Notes |
|---|---|---|---|---|
| 一本收费网站下的女套装款式书籍/ | folder, 86 jpg | excluded (as pattern source) | sampled | Japanese sewing book (文化出版局, ISBN 978-4-579-11343-9), scanned as half-page jpgs. Carries technical flats, 裁合せ図 cutting layouts and sewing order — but the garments reference 実物大型紙, a full-size pattern sheet **not present in the scan**, and there are no drafting formulas. Style/construction reference only. Watermarked www.pop136.com — provenance differs from the physically-scanned books |
| 手钩婴儿鞋Chaussons_BB.rar → `手钩婴儿鞋Chaussons BB/` | RAR + 36 jpg | excluded | sampled | *Crochet — Des chaussons pour bébé*, Cendrine Armani (Éditions Didier Carpentier). Crochet booties: stitch charts, not sewn flat patterns. Unpacked by the user 2026-08-03 |
| 中岛柚子.rar → `中岛柚子/` | RAR + 188 jpg | excluded (as pattern source) | sampled | ⚠ **Not one book — two unrelated scan sets were combined.** Main folder (112 files): a Japanese *Pattern Magic*-genre draping/manipulation catalogue (draped photo + resulting flat piece, cross-referenced "解説NNページ"), no measurement formulas. Subfolder `新建文件夹` (76 files): an unrelated **Chinese sleeve/armhole drafting excerpt** with real formulas (`后AH+0.5`, figures 图1-2-9…图3-1-4, folios ·27·) — source book unidentified. Neither part has a cover. Note the folder name 中岛柚子 does **not** match 中道友子 (Nakamichi), the Pattern Magic author — provenance of the label is unclear |
