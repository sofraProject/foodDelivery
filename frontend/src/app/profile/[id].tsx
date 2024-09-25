import { useRouter } from "next/router";

export default function Sample() {
  const imed = useRouter();
  console.log(imed);

  return <p>Hello Next</p>;
}
