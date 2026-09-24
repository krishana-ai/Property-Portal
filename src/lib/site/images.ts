/**
 * Site photography, self-hosted in /public/images (see public/images/CREDITS.md).
 *
 * Served from our own origin so pages never depend on a third-party CDN, and
 * optimised by next/image (sharp) into responsive WebP/AVIF. Each photo has a
 * tiny inline blur preview so nothing ever renders as an empty box.
 */
const img = (name: string) => `/images/${name}.jpg`;

export const IMG = {
  // Jaipur & hero
  heroVilla: img("hero-villa"),
  heroHawaMahal: img("hero-hawa-mahal"),
  heroJalMahal: img("hero-jal-mahal"),
  jaipurSkyline: img("jaipur-skyline"),
  patrikaGate: img("patrika-gate"),
  jaipurStreet: img("jaipur-street"),
  amerFort: img("amer-fort"),

  // Residential exteriors
  apartmentPark: img("apartment-park"),
  apartmentTower: img("apartment-tower"),
  apartmentBlock: img("apartment-block"),
  apartmentModern: img("apartment-modern"),
  underConstruction: img("under-construction"),
  builderFloor: img("builder-floor"),
  societyGarden: img("society-garden"),
  township: img("township"),
  townshipLawn: img("township-lawn"),
  villaRow: img("villa-row"),
  townhouses: img("townhouses"),
  brickHouse: img("brick-house"),

  // Interiors, commercial & land
  livingWarm: img("living-warm"),
  livingBright: img("living-bright"),
  livingDining: img("living-dining"),
  livingLounge: img("living-lounge"),
  kitchen: img("kitchen"),
  bedroom: img("bedroom"),
  studio: img("studio"),
  office: img("office"),
  shop: img("shop"),
  land: img("land"),

  // People
  personRitika: img("person-ritika"),
  personMahesh: img("person-mahesh"),
  personSneha: img("person-sneha"),
  personImran: img("person-imran"),
} as const;

/** ~150-byte WebP previews keyed by image path, used as next/image blurDataURL. */
const BLUR: Record<string, string> = {
  "/images/amer-fort.jpg": "data:image/webp;base64,UklGRmoAAABXRUJQVlA4IF4AAAAQBACdASoMABUAPyV8tFGuJ6UisAgBwCSJagCdMoR4GCn91hT9qQrUGAD+sENNFsZNmXEYqkiFQUJhx87fX4CxEuUNU1TKV/NZtKL2zpOw1YLLi0V274+gwQuBIwAA",
  "/images/apartment-block.jpg": "data:image/webp;base64,UklGRkAAAABXRUJQVlA4IDQAAADQAQCdASoMAAgABIByJZwAAtpA6yxiAAD+5/p7qnUVyrTiZRjHC4mLObjuHsW2Z0XjghAA",
  "/images/apartment-modern.jpg": "data:image/webp;base64,UklGRkQAAABXRUJQVlA4IDgAAADwAQCdASoMAAgABIByJQBOgCILZ92w/yAA/tS09O7N5xaPVnSp5e4X/vOi/Y4tP+SkPand5uRAAA==",
  "/images/apartment-park.jpg": "data:image/webp;base64,UklGRlYAAABXRUJQVlA4IEoAAADQAQCdASoMAAsABIByJbACdACRGrNAAADts5YIgppETodFEv13o4vpmvtP5dpqsif9bsSh8hbDG/iBvEnzp7bHcLTtR8z6f14AAA==",
  "/images/apartment-tower.jpg": "data:image/webp;base64,UklGRk4AAABXRUJQVlA4IEIAAACwAQCdASoMAAkABIByJZwAAlmYAVSAAP7YXykYgS4mZ8N/e4yWznEjOy8UhIpkhe0j+86N1NN5hAJNc+PD65B7QgA=",
  "/images/bedroom.jpg": "data:image/webp;base64,UklGRkgAAABXRUJQVlA4IDwAAADQAQCdASoMAAgABIByJYgCdACUb6WXAAD87EBrkmPGQoSNTVqMJa22Vl1mu5bCZT71uFb+97dRN2VQAAA=",
  "/images/brick-house.jpg": "data:image/webp;base64,UklGRkQAAABXRUJQVlA4IDgAAACwAQCdASoMAAgABIByJQBdgBCPQfQAAP7ZkRU7pj5ZIu5IuiPTScNgU3MjEb46+fak5rRyr8AAAA==",
  "/images/builder-floor.jpg": "data:image/webp;base64,UklGRmgAAABXRUJQVlA4IFwAAADwAQCdASoMABAABIByJbACdADcwpyPUAAA9pkbxdvv9sBIs1WbRj+lR/aCfd914areAL9ubRVWWd6DQMe6hQtHMcfyn8WwGgt94/EPkfBsv7ZO317+Xkp9oqgAAA==",
  "/images/hero-hawa-mahal.jpg": "data:image/webp;base64,UklGRkwAAABXRUJQVlA4IEAAAADQAQCdASoMAAgABIByJZACdADb63Q2AADLPEKhH0UPdqsMvT388r22sLS+1KtLCUDYv8v0IeV8RoXxJ9DZkUAA",
  "/images/hero-jal-mahal.jpg": "data:image/webp;base64,UklGRk4AAABXRUJQVlA4IEIAAADwAQCdASoMAAgABIByJQBOgCauU7PBaAAA/okRlJD8edb0q88H/SWnIq3tq4cQfXJPvXSBG/oD2WR9HVPY6BhTgAA=",
  "/images/hero-villa.jpg": "data:image/webp;base64,UklGRk4AAABXRUJQVlA4IEIAAADwAQCdASoMAAgABIByJYgCdAELMxz2AAAA9rGuJscsfasHYRDPOeh6y1nkVYAs2XRrkfAH2oXhZJ3AB5Wv+et+gAA=",
  "/images/jaipur-skyline.jpg": "data:image/webp;base64,UklGRj4AAABXRUJQVlA4IDIAAADQAQCdASoMAAgABIByJZQCdAEOjka/AAD+xgO1VPPKWKLMWsWUmjPlgJq+TZQQYwAAAA==",
  "/images/jaipur-street.jpg": "data:image/webp;base64,UklGRkAAAABXRUJQVlA4IDQAAADwAQCdASoMAAcABIByJQBOgCHo7X7Ba8AA/fA1F0dyyF/P0CdrA7D31gefBeZLKIx/OPgA",
  "/images/kitchen.jpg": "data:image/webp;base64,UklGRkwAAABXRUJQVlA4IEAAAADwAQCdASoMAAgABIByJZQAAl3dMhMlNAAA/PD9++NCMZBMa2tEyYSQEsAF/tg5oI9FuLOGrSTKea6zfN2b8FAA",
  "/images/land.jpg": "data:image/webp;base64,UklGRkoAAABXRUJQVlA4ID4AAADQAQCdASoMAAcABIByJbACdADcSyEBAAD2Pvc0FSzcO6l3eiveBymUDQKSAtrYTT0TrBrWyHYgAFC5PgAAAA==",
  "/images/living-bright.jpg": "data:image/webp;base64,UklGRloAAABXRUJQVlA4IE4AAADwAQCdASoMAAkABIByJYgCdAEQdqqhowAA/mu4HBNlbO/FEanTtZSdNmnMx1Ljm0XCs/HFq/puVHoZXVJDmrFIQD4S0PrpemJjtdYTAAA=",
  "/images/living-dining.jpg": "data:image/webp;base64,UklGRkAAAABXRUJQVlA4IDQAAADQAQCdASoMAAgABIByJQBOgBe6dx0jYAD+xEEILnnxCzwNiFMlKXQairOhj1c+utT98oAA",
  "/images/living-lounge.jpg": "data:image/webp;base64,UklGRk4AAABXRUJQVlA4IEIAAADQAQCdASoMAAkABIByJQBOgBZ09egHMADfzWFn4MsBHn6G7bxTlZW70agRANo3rZn25L6qwEsM9m+mc8Qb7dgAAAA=",
  "/images/living-warm.jpg": "data:image/webp;base64,UklGRlIAAABXRUJQVlA4IEYAAADwAQCdASoMAAsABIByJQBOgB6S2doWikAA/k9dulGioImCzehgx+pXYfsm9RG8KwQVr2bP1kUxNe/Wvx3nK1rSeXjWKAAA",
  "/images/office.jpg": "data:image/webp;base64,UklGRkAAAABXRUJQVlA4IDQAAACQAQCdASoMAAgABIByJZQAApzr9gAA/n6QOo5ioRjQgcCcc3FkqMr3Op9hXj1zxVFvywAA",
  "/images/patrika-gate.jpg": "data:image/webp;base64,UklGRlAAAABXRUJQVlA4IEQAAAAQAgCdASoMAAgABIByJaACdAECweOjiDIYAP6Zd4cPG96ZUKoL9ytiwo5dcFiIMn/n6LjMqxwm2Tb6MNReqXED/4pgAA==",
  "/images/person-imran.jpg": "data:image/webp;base64,UklGRlAAAABXRUJQVlA4IEQAAACwAQCdASoMAAwABIByJQAAS4gsJXIAAP7y3QqoQwhYGvufxK/lG3nOdAx02RgXqHf7rRwPLjBFypWnfTjhL3CTo8IAAA==",
  "/images/person-mahesh.jpg": "data:image/webp;base64,UklGRlIAAABXRUJQVlA4IEYAAADQAQCdASoMAAwABIByJbACdADb6xjSgAD+s1TC0fI8fiQ7O2D6cqKHCgdrk02VMUqELTxTi1YMBUFcms/4yCvmdmUMdNgA",
  "/images/person-ritika.jpg": "data:image/webp;base64,UklGRk4AAABXRUJQVlA4IEIAAADwAQCdASoMAAwABIByJYgCdADdrlAe+IAA/tltMs1fCjtQqjnJsKwnGWWJVsWCJWu8Nb/ezK/fCRaTDpZpBfRykAA=",
  "/images/person-sneha.jpg": "data:image/webp;base64,UklGRlIAAABXRUJQVlA4IEYAAAAQAgCdASoMAAwABIByJaACdAELUN4sCFjgAP7zdboj5d5DwHiIeZaow9qDiP/RWZms2XdMqT0loN86fiVMoTXOswiNJAAA",
  "/images/shop.jpg": "data:image/webp;base64,UklGRkAAAABXRUJQVlA4IDQAAACwAQCdASoMAAgABIByJZwAAlr8kRwsAP4ncpith1o6IvpHkQbTc+1rxfMhcBAFKd7wAAAA",
  "/images/society-garden.jpg": "data:image/webp;base64,UklGRkgAAABXRUJQVlA4IDwAAADQAQCdASoMAAkABIByJZQAAxdCaKaQAAD+tZyauat1cKAY8M6SCW4Qg+5PsMlJkEbZOgMFia/+lBpZgAA=",
  "/images/studio.jpg": "data:image/webp;base64,UklGRkYAAABXRUJQVlA4IDoAAACwAQCdASoMAAgABIByJZgCdADZoKqwAPzQ7dPQ/YsAfH4rNzFiSSQqJAS9m3g+TRzMrPhjjf5DkAAA",
  "/images/townhouses.jpg": "data:image/webp;base64,UklGRkQAAABXRUJQVlA4IDgAAADwAQCdASoMAAcABIByJYwCdADv9T3RSAAA/tzbrOjRkorzr7jTTOkboAt48AkS7bnUp0m1XAAAAA==",
  "/images/township-lawn.jpg": "data:image/webp;base64,UklGRkgAAABXRUJQVlA4IDwAAADwAQCdASoMAAkABIByJZgCdH8AF8JQSgAA/eOqA/mJGhsYy9xQ72JCUZy8LjJfyRk4tTXGAY2crQLctAA=",
  "/images/township.jpg": "data:image/webp;base64,UklGRkQAAABXRUJQVlA4IDgAAACwAQCdASoMAAkABIByJQAAYsvJw6VwAP7zkMl9ZO65v8m5Lm444HpcL3/stb8BGi0STG105AAAAA==",
  "/images/under-construction.jpg": "data:image/webp;base64,UklGRlQAAABXRUJQVlA4IEgAAAAwAgCdASoMAA0ABIByJZgCdAD6m+U+Nap/oAD+3r7dVAWap/rgb/q2PCnuBKcwR/InjylF86gMeoC1tPqzIDTQXPCtHCTAAAA=",
  "/images/villa-row.jpg": "data:image/webp;base64,UklGRkgAAABXRUJQVlA4IDwAAAAQAgCdASoMAAoABIByJYgCdGuAAs06QnEAAP7VCHbq7zcDehoWeNV+zBT193Cvp+3WwjtxeS3fTk+AAAA=",
};

/** Props to spread onto next/image for an instant blurred preview. */
export function blurProps(src: string): { placeholder: "blur"; blurDataURL: string } | Record<string, never> {
  const data = BLUR[src];
  return data ? { placeholder: "blur", blurDataURL: data } : {};
}
