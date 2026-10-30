# CLAUDE.md

Zamn's fork of bbb-playback (remote: `zamnLMS/bbb-playback`). Production runs a tag from the `zamn` branch, built by the Scalelite Dockerfile. It is always a tag, never a branch.

## Do not change the desktop player: the MP4 export depends on it

`zamnLMS/bbb-recorder` (`export.js`) turns recordings into MP4 files. It opens this player in real Chrome through Puppeteer and records the screen. Whatever the desktop player shows ends up in every MP4, and a renamed or moved element can stop the export.

What the export does:
- Opens `https://rec.zamn.app/playback/presentation/2.3/<id>?l=disabled` in a 1920x1080 window.
- Reads the video from `#vjs_video_3` and `#vjs_video_3_html5_api`, including `duration`.
- Watches `#vjs_video_3.vjs-error` and `.loader-wrapper` to detect a stuck page.
- Hides `#vjs_video_3 > div.vjs-control-bar`, then clicks `.vjs-big-play-button`.

Rules:
- A change must not touch the desktop layout, buttons or element names unless the user asks for it. Keep every name above.
- Screens below 480px are the phone layout. In `src/components/player/index.scss`, the base rules are the phone layout and the `@media (min-width: $media-min-width)` block is desktop. Anything added to a base rule also reaches desktop unless that block overrides it.
- JavaScript runs at every width, so treat any JavaScript change as a desktop change.
- Before shipping a player change, build the old and new versions and compare them at 1920x1080 with `?l=disabled`: elements, screenshots, and the export steps above. Use a fake local recording.
- Do not run `export.js` locally. It connects to production.
