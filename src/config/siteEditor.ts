const SITE_EDITOR_UIDS = new Set(['GyGIzzyfEEfLAA8jfsOzcu6GupF3']);

export const isSiteEditorAccount = (uid: string): boolean => SITE_EDITOR_UIDS.has(uid);
