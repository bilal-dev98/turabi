export const AVAILABLE_COLORS = [
    // Existing base colors (Row 1-ish)
    { name: "Black", hex: "#0f172a" },
    { name: "White", hex: "#f8fafc" },
    { name: "Gray", hex: "#64748b" },
    { name: "Red", hex: "#ef4444" },
    { name: "Pink", hex: "#ec4899" },
    { name: "Purple", hex: "#a855f7" },
    { name: "Indigo", hex: "#6366f1" },
    { name: "Blue", hex: "#3b82f6" },
    { name: "Cyan", hex: "#06b6d4" },
    { name: "Teal", hex: "#0f766e" },
    { name: "Green", hex: "#22c55e" },
    { name: "Lime", hex: "#84cc16" },
    { name: "Yellow", hex: "#facc15" },
    { name: "Amber", hex: "#f59e0b" },
    { name: "Orange", hex: "#f97316" },
    { name: "Rose", hex: "#f43f5e" },
    { name: "Maroon", hex: "#7f1d1d" },
    { name: "Brown", hex: "#78350f" },

    // User provided rows
    ...[
        // Row 1
        "#E6DBD1", "#E4D7CB", "#E0D7C6", "#D8D6C1", "#CBD3BC", "#BCCEC5", "#B6C9C9", "#B6C9CE", "#BDC9D3", "#C5CAD8", "#C9C9D7", "#CEC9D6", "#D3C8D4", "#D7C9D3", "#D9C9D0", "#D4C9CD", "#D0D0D4", "#CFCFD4", "#D0CFD3", "#D0CED2",
        // Row 2
        "#DCC4C0", "#E2D0B7", "#E3D7AD", "#E1DDA7", "#C9D9A7", "#B4D2B9", "#A9CFBA", "#A4CECA", "#A3CDD2", "#AEC8D7", "#B2C3D7", "#B3C0D6", "#BDBBD2", "#C6B9D1", "#CEBAD0", "#D4BBCD", "#D7BCBF", "#C9CDD1", "#C9CCD0", "#CACCCD",
        // Row 3
        "#E6B4B2", "#EBC79D", "#EAD687", "#E9DD7D", "#C1E07F", "#9FD5B0", "#8FD3B2", "#80D2C6", "#84CFD8", "#94C4D9", "#9CBAD8", "#9FB4D6", "#B4ADD6", "#BEABD3", "#D2AAD6", "#DBABC6", "#E2B0B5", "#BDC3CD", "#C2C2C5", "#C3C2C3",
        // Row 4
        "#E99592", "#F0B36C", "#F6CE3B", "#F7DC1D", "#AFE24B", "#73D594", "#60D2A3", "#4FD0BC", "#55C9D6", "#68B4D5", "#7CA8D5", "#869BD6", "#A69AD6", "#B595D6", "#C991D8", "#D98DB7", "#E78E98", "#AEB6C2", "#B3B6BB", "#B7B6B7",
        // Row 5
        "#FB6161", "#FF8B08", "#F6B13F", "#F3C04A", "#95E12D", "#12D26F", "#3EC694", "#45C1AF", "#4BBAD4", "#33A7D6", "#5695D9", "#6E7DDA", "#8D76D8", "#A56FDC", "#CB5EDC", "#E556A6", "#F75F77", "#909EB1", "#989EAA", "#9F9C9A",
        // Row 6
        "#FF2A2E", "#FF6A2C", "#F8993A", "#E9B13F", "#7BD036", "#35C54D", "#44B989", "#43B2A2", "#46A7C4", "#4298D2", "#3979D9", "#5B61DC", "#7F52E0", "#9F42E1", "#D42EE5", "#EB2E8F", "#FF1E4D", "#6F7E94", "#777D8A", "#7E7A78",
        // Row 7
        "#F31607", "#FA4728", "#E06E2A", "#CE882E", "#5AA424", "#30A338", "#369B64", "#379488", "#378CA8", "#357DC0", "#265EDE", "#4B3EE2", "#7D22EA", "#9F14E8", "#C11ED2", "#E31C72", "#F21F3A", "#4F5E74", "#57606D", "#5E5B58",
        // Row 8
        "#D10D04", "#D63117", "#C04E18", "#A9621C", "#447E11", "#1E7E2C", "#26764E", "#21786E", "#26758C", "#2B689D", "#274BD2", "#4732D2", "#6E12E5", "#8B0FE2", "#AA18BE", "#C80F5B", "#CF1831", "#384860", "#404C5E", "#474442",
        // Row 9
        "#C4060D", "#B32D00", "#9F4100", "#8C4C00", "#385D00", "#066B33", "#1A653F", "#116560", "#106679", "#1D5982", "#2640B2", "#4330A4", "#6618B8", "#7E18B5", "#9B0CA1", "#B2064A", "#B9082E", "#212F45", "#272A2F", "#2D2927",
        // Row 10
        "#981A1C", "#902A05", "#873600", "#7C4300", "#324F00", "#0F5C2A", "#075839", "#0E4F4C", "#1A5163", "#0F4E6F", "#29418B", "#3F3680", "#57269C", "#682392", "#7C1C7A", "#931043", "#9F002A", "#06142D", "#13141A", "#171413",
        // Row 11
        "#6F0000", "#690E00", "#5F1A00", "#552200", "#213F00", "#003E18", "#00382A", "#003436", "#043342", "#052E48", "#232460", "#34166C", "#49096A", "#5C005F", "#6C003C", "#7C0026", "#7E001A", "#00081C", "#030507", "#050504"
    ].map(hex => ({ name: hex, hex }))
];

export const getColorHex = (colorName) => {
    // If it's already a hex code (e.g. from the extended rows), return it directly
    if (colorName.startsWith('#')) return colorName;

    // Otherwise look up the name
    const color = AVAILABLE_COLORS.find(c => c.name.toLowerCase() === colorName.toLowerCase());
    return color ? color.hex : '#cccccc'; // fallback color
};
