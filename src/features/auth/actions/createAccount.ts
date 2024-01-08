const host = window.location.host.replace(/^www\./, "");
const REFERRER_LS_KEY = `sb_wiz.ref-key.v.${host}`;

const ambassadors: Record<string, string> = {
  celinhotv: "2253",
  allrichard: "11879",
  techaton: "52704",
  muaddib: "81877",
  nailguns: "137468",
  rollerarv: "161863",
  canaldomarinho: "163916",
};

export function saveReferrerId(id: string) {
  // if ID is Ambassador name, get the ID
  if (id.toLowerCase() in ambassadors) {
    localStorage.setItem(REFERRER_LS_KEY, ambassadors[id]);
  } else localStorage.setItem(REFERRER_LS_KEY, id);
}

export function getReferrerId() {
  const item = localStorage.getItem(REFERRER_LS_KEY);

  if (!item) {
    return undefined;
  }

  return Number(item);
}

const SIGN_UP_LS_KEY = `sb_wiz.signup-key.v.${host}`;

type SignupMethod = "paidMint" | "freeMint";
export function saveSignupMethod(id: SignupMethod) {
  localStorage.setItem(SIGN_UP_LS_KEY, id);
}

export function getSignupMethod(): SignupMethod {
  const item = localStorage.getItem(SIGN_UP_LS_KEY) as "paidMint" | "freeMint";

  return item || undefined;
}
