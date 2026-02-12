export interface NoteDetail {
    key: string;
    value: string;
    sensitive: boolean;
}

export interface Note {
    // original JSON uses `noteId`
    noteId: number;
    title: string;
    details: NoteDetail[];
    createdAt: string; // ISO timestamp

    // optional legacy fields for backward compatibility
    id?: number;
    content?: string;
}

export function mapJsonToNote(json: any): Note {
    return {
        noteId: json.noteId ?? json.id ?? 0,
        title: json.title ?? '',
        details: Array.isArray(json.details)
            ? json.details.map((d: any) => ({
                  key: String(d.key ?? ''),
                  value: String(d.value ?? ''),
                  sensitive: !!d.sensitive,
              }))
            : [],
        createdAt: json.createdAt ?? new Date().toISOString(),
        id: json.id,
        content: json.content,
    };
}