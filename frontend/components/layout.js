import Footer from "./footer";
import Wallet_modal from "./modal/wallet_modal";
import BuyModal from "./modal/buyModal";
import { useRouter } from "next/router";
import Header01 from "./header/Header01";

export default function Layout({ children }) {
  const route = useRouter();

  return (
    <>
      <Header01 />
      <Wallet_modal />
      <BuyModal />
      <main>{children}</main>
      <Footer />
    </>
  );
}
