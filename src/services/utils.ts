export const formatGrinAmount = (amount: number): number => {
  return amount / Math.pow(10, 9);
};

export const validateUrl = (url: string): boolean => {
  return /[(http(s)?)://(www.)?a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/gi.test(
    url
  );
};

export const validateSlatepackAddress = (address: string): boolean => {
  if (address.length === 63) {
    const slatepack_fmt = "grin1[qpzry9x8gf2tvdw0s3jn54khce6mua7l]{58}";
    return new RegExp(`${slatepack_fmt}`).test(address.toLowerCase());
  }

  return false;
};

export const validateSlatepack = (slate: string): boolean => {
  return (
    slate.toUpperCase().includes("BEGINSLATEPACK.") &&
    slate.toUpperCase().includes("ENDSLATEPACK.")
  );
};

export const validateAddress = (
  address: string
): "http" | "slatepack" | false => {
  address = address.replace(/\/$/, "");
  if (validateSlatepackAddress(address)) {
    return "slatepack";
  } else if (validateUrl(address)) return "http";
  return false;
};

export const writeTextFile = (path: string, text: string) => {
  require("fs").writeFileSync(path, text);
};

export const getHomePath = (): string => {
  return require("electron").remote.app.getPath("home");
};

export const getPathSeparator = (): string => {
  switch (require("electron").remote.process.platform) {
    case "win32":
      return `\\`;
    default:
      return "/";
  }
};
