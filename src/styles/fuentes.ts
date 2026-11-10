import { Rubik, Unbounded } from "next/font/google";

export const unbounded = Unbounded({
  subsets: ["latin"],
  weight: ["600", "700", "900"],
  variable: "--fuente-unbounded-next",
  display: "swap",
});

export const rubik = Rubik({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--fuente-rubik-next",
  display: "swap",
});
