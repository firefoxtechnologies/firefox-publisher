import { isNativeApp } from "./api.js";

export const isIOS = () =>
  typeof navigator !== "undefined" && (/iP(hone|ad|od)/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1));

const toBase64 = (blob) =>
  new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result).split(",")[1]);
    r.onerror = () => reject(r.error);
    r.readAsDataURL(blob);
  });

// Saves a finished file. Returns "shared" (a phone share/save sheet was shown), "downloaded" or "cancelled".
//  - In the installed Android/iPhone app the file is written to the app's cache and the phone's own
//    Share sheet opens, where the person picks "Save to Files", Photos, Drive, a message app and so on.
//  - On iPhone Safari the browser's share sheet is used the same way.
//  - Everywhere else it is a normal browser download.
export async function saveFile(blob, name) {
  if (isNativeApp()) {
    try {
      const [{ Filesystem, Directory }, { Share }] = await Promise.all([import("@capacitor/filesystem"), import("@capacitor/share")]);
      const { uri } = await Filesystem.writeFile({ path: name, data: await toBase64(blob), directory: Directory.Cache });
      await Share.share({ title: name, url: uri, dialogTitle: "Save or share your file" });
      return "shared";
    } catch (e) {
      if (/cancel/i.test(String(e && e.message))) return "cancelled";
      // Fall through to the browser way if the native plugins are not available.
    }
  }
  if (isIOS() && navigator.canShare) {
    const file = new File([blob], name, { type: blob.type });
    if (navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({ files: [file], title: name });
        return "shared";
      } catch (e) {
        if (e.name === "AbortError") return "cancelled";
      }
    }
  }
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  return "downloaded";
}
