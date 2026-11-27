---
name: update-song-meta
description: "Ingest new raw song files into the music app: convert data/raw/*.mpeg (or other audio) to mp3 in data/songs with ffmpeg, update the songs section of data/meta.json (songId, name, tags), infer original singer and language tags, add the 翻唱 tag, handle duplicate names, and delete each raw source file after processing. Use when the user says 更新songs和meta.json, adds files to data/raw, or asks to process/ingest raw songs."
argument-hint: "optional: extra tags to add, e.g. /update-song-meta 加tag 现场版"
---

# Update Song Meta (raw → mp3 + meta.json)

Ingest every file in `data/raw/` into the app's song library.

## Conventions (this repo)

- `data/raw/` — dropped source audio (usually `.mpeg`), emptied as each file is processed
- `data/songs/` — final mp3 files; `songId` = mp3 basename (no extension)
- `data/meta.json` — `{ "songs": [ { "name", "tags", "songId" } ] }`
- Tags format: `[原唱歌手, 语言, 翻唱]` — every song gets `翻唱` (all songs here are covers). Add any extra tags the user requests in the invocation.
- Languages used: `中文`, `日语`, `英语` (match script of the original song)
- The app fetches meta.json + mp3s from GitHub (`raw.githubusercontent.com`), so remind the user to `git add`/commit/push `data/` for songs to appear in the deployed app.

## Procedure

1. **List inputs**: `ls data/raw` and `ls data/songs`. Note existing songIds in `data/meta.json`.

2. **Check for name collisions BEFORE writing anything**:
   - If a raw file's basename already exists in `data/songs/` (or would duplicate another raw file), STOP and confirm with the user first. On approval, give the new file a unique suffix like `<name>_2.mp3` (next free number) and use that as `songId`.

3. **Convert each file** (one at a time, then immediately delete its raw source):
   ```bash
   ffmpeg -nostdin -loglevel error -y -i "data/raw/<name>.mpeg" -codec:a libmp3lame -q:a 2 "data/songs/<name>.mp3"
   rm "data/raw/<name>.mpeg"
   ```
   Verify the mp3 exists before deleting the raw file.

4. **Determine tags for each song**:
   - Raw files here carry NO artist ID3 metadata (only ComfyUI workflow JSON in `prompt`/`workflow` tags) — do not expect artist/title tags; infer the original singer from the song title.
   - Check `data/meta.json` first for previously confirmed singers (e.g. 当你孤单时你会想起谁=张栋梁, golden=猎魔女团, 炭治郎之歌=椎名豪, 骑在银龙的背上=中岛美雪).
   - If the original singer or language is uncertain, ask the user (offer likely candidates as options) before editing meta.json.

5. **Update `data/meta.json`**: append one entry per new song, keeping the existing 4-space / nested formatting:
   ```json
   {
       "name": "<song title>",
       "tags": ["<原唱>", "<语言>", "翻唱"],
       "songId":"<mp3 basename>"
   }
   ```

6. **Validate**: `node -e "JSON.parse(require('fs').readFileSync('data/meta.json','utf8'))"` and confirm `data/raw/` is empty.

7. **Report** a table of song → singer/language, note any renames due to duplicates, and remind the user to push `data/` to GitHub for the app to pick the songs up.
