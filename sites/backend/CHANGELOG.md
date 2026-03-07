# Change log for: @freesewing/backend


## 4.6.0 (2026-03-01)

### Changed

 - Remove Prisma dependency, refactor to use NodeJS native SQLite bindings (#765)
 - Run backend in container image freesewing/backend (#765)

## 4.0.1 (2025-06-09)

### Fixed

 - Newsletter unsubscribe links lead to 404

## 3.0.0 (2023-09-30)

### Changed

 - All FreeSewing packages are now ESM only.
 - All FreeSewing packages now use named exports.
 - Dropped support for NodeJS 14. NodeJS 18 (LTS/hydrogen) or more recent is now required.

## 2.20.5 (2022-02-17)

### Fixed

 - Mitigate risk of denial-of-service attacks in catch-all route


This is the **initial release**, and the start of this change log.

> Prior to version 2, FreeSewing was not a JavaScript project.
> As such, that history is out of scope for this change log.

