# The Palace of Two Families

A lightweight, mobile-first Indian wedding invitation. The experience follows one visual idea: a palace threshold opening into a courtyard, a gathering hall, and a final quiet scene. It uses plain HTML, CSS, and JavaScript so the site stays quick to load and easy to host.

## Run locally

From this folder, run `python3 -m http.server 8000` and open <http://localhost:8000>. Any static web server or static host can serve the folder. The opening asks for a tap before it tries to play the song, so browser autoplay restrictions are handled by the invitation itself.

## Edit wedding details

Update [`wedding.js`](wedding.js). Couple names, family names, date, timezone, venue, music, story, events, and the Apps Script form endpoint all live there. Keep the visible `[PLACEHOLDER]` values until you have confirmed details.

For a live countdown and calendar files, set `dateTime` to an ISO date-time with its UTC offset, such as `2027-02-14T18:30:00+05:30`. This makes the instant unambiguous across guest timezones. Set `timezone` to the IANA timezone name (for example `Asia/Kolkata`) for your own reference. Add `mapsUrl` for the venue and for any event with a different location.

## Add photographs, music, and video

Put files in these folders and set the matching `src` values in `wedding.js`:

```text
public/                     # Copy these assets into the site root when using the included folder layout
  images/
    hero/                   # Optional couple hero image or poster
    story/                  # Couple / family memories
    events/                 # Optional event art
    venue/                  # Venue photograph
    og-wedding.jpg          # 1200 × 630 social sharing image
  audio/
    wedding-song.mp3        # Replace with the licensed song file
  video/
    hero.mp4                # Optional, muted, compressed background film
  textures/
  illustrations/
```

This project is already served from its root, so place the listed `images/`, `audio/`, and `video/` folders beside `index.html` (the `public/` prefix above is a suggested organization for a later framework migration). Put the song at `audio/wedding-song.mp3`; the audio control will report when the file is missing. No music is bundled. The current illustrations are drawn in CSS, so the experience remains complete before photography or video is added. Story `image` values accept paths such as `images/story/moment-01.webp`. Keep images compressed and use descriptive alt text.

## RSVP and wishes

Both forms POST to the Apps Script web app URL in `wedding.js` (`formEndpoint`). The script writes RSVPs to the `RSVPs` tab and wishes to the `Wishes` tab. Keep the spreadsheet private; the deployed endpoint is public so guests can submit without signing in, and its URL is visible in the site source. The current script only appends validated submissions and does not return sheet contents. Wishes are not displayed publicly on the site.

The page shows success only when the endpoint returns `{ ok: true }`. If you redeploy the Apps Script and receive a new `/exec` URL, update `formEndpoint` in `wedding.js`.

## Social sharing

The page includes Open Graph and Twitter metadata. Add `images/og-wedding.jpg` (1200 × 630) with the couple's names and date, then the page currently uses the couple hero photo as its preview image. Update the `og:image` URL in `index.html` to the full GitHub Pages URL after deployment so social platforms can load it.

## Accessible interactions

The invitation uses semantic sections, keyboard-operable controls, focus indicators, reduced-motion support, a user-gesture sound start. A missing date, map URL, or audio file does not block reading the invitation.

## Publish with GitHub Pages

This is a static site and can be hosted free from a public GitHub repository. The included workflow deploys the repository root whenever you push to `main`. In GitHub, open **Settings → Pages** and choose **GitHub Actions** as the build and deployment source. After the workflow finishes, the site will be available at `https://YOUR-USERNAME.github.io/palace-wedding-invitation/`. The local asset paths are relative so images and audio also work at that project URL.
