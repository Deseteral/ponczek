# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased
### Added
- New test scene to example app: Sprite drawing test scene

## [2.0.0] - 2023-10-12
### Added
- Support for left and right mouse buttons.
- Euclidean search heuristic to pathfinding implementation.
- `String#capitalize` method.
- Sound can be played with specific volume.
- `Screen#clear*` methods for all existing primitives.
### Changed
- Renamed all `Screen#fill*` methods to `Screen#draw*`.
- Renamed all `Screen#draw*` methods to `Screen#draw*Lines*`.
### Fixed
- Fixed ImGui crashing the game in incognito mode.
- Various bug fixes, stability and performance improvements.

## [1.1.0] - 2023-09-28
- Added ImGui

## [1.0.0] - 2023-02-04
- Initial release

[unreleased]: https://github.com/Deseteral/ponczek/compare/v1.1.0...HEAD
[2.0.0]: https://github.com/Deseteral/ponczek/releases/tag/v1.1.2...v2.0.0
[1.1.2]: https://github.com/Deseteral/ponczek/releases/tag/v1.1.1...v1.1.2
[1.1.1]: https://github.com/Deseteral/ponczek/releases/tag/v1.1.0...v1.1.1
[1.1.0]: https://github.com/Deseteral/ponczek/releases/tag/v1.0.0...v1.1.0
[1.0.0]: https://github.com/Deseteral/ponczek/releases/tag/v1.0.0
