import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import BigInput from "../../../components/big-input";
import InfoCard from "../../../components/info-card";
import TransactionDescriptions from "../transaction-descriptions";
import { useSelector } from "react-redux";
import walletServices from "../../../services/wallet-services";
import Clipboard from "@react-native-community/clipboard";
import QrCreateModalize from "./read-qr";
import DropdownAlert from "../../../providers/DropdownAlert";
import { getLang } from "../../../helpers/array-helper";
import Networks from "../../../components/networks";
import ModalProvider from "../../../providers/ModalProvider";
import { PADDING_H, SCREEN_WIDTH } from "../../../../utils/dimensions";
import QRCode from "react-native-qrcode-svg";
import EmptyContainer from "../../../components/empty-container";
import CustomButton from "../../../components/button";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import PulseAnimation from "../../../components/pulse";
import QrResult from "../../../components/qr-result";


const DepositBtcScreen = (props) => {
  const { wallet, showModal } = props;
  const { activeTheme, activeThemeKey } = useSelector(state => state.globalReducer);
  const [walletAddress, setWalletAddress] = useState("");
  const [visibleWalletAddress, setVisibleWalletAddress] = useState("");
  const { language } = useSelector(state => state.globalReducer);
  const [networks, setNetworks] = useState([]);
  const [destinationTag, setDestinationTag] = useState("");
  const [networkInstance, setNetworkInstance] = useState({});
  const [activeNetwork, setActiveNetwork] = useState("");
  const [activeNetworkName, setActiveNetworkName] = useState("");
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState(false);
  const [isMemo, setIsMeMo] = useState("");
  const [isTag, setIsTag] = useState("");
  const [descriptions, setDescriptions] = useState([
    {
      id: 1, text: "COIN_DEPOSIT_DESCRIPTION",
    },
    { id: 2, text: "COIN_DEPOSIT_MIN_DESCRIPTION" },
  ]);


  useEffect(() => {
    if (wallet && wallet.gd) {
      // setFetching(true);
      setIsMeMo("");
      setIsTag("");
      setNetworks([]);
      setWalletAddress("");
      setVisibleWalletAddress("");
      setDestinationTag("");
      setDescriptions([
        { id: 1, text: "COIN_DEPOSIT_DESCRIPTION" },
        { id: 2, text: "COIN_DEPOSIT_MIN_DESCRIPTION" },

      ]);
      walletServices.getNetworks(wallet.gd).then((response) => {
        // setFetching(false);
        if (response && response.Data.length >= 1 && response.Data[0].netWorks.providerNetWorks && response.Data[0].netWorks.providerNetWorks) {
          setNetworks(response.Data[0].netWorks.providerNetWorks);
        } else {
          setActiveNetwork(0);
          setActiveNetworkName(wallet.cd);
        }
      });
    }
  }, [wallet]);

  useEffect(() => {
    if (walletAddress) {
      const memoIndex = walletAddress.indexOf("?memoId=");
      const tagIndex = walletAddress.indexOf("?dt=");
      if (memoIndex !== -1) {
        setIsMeMo(walletAddress.substring(memoIndex + 1));
        setVisibleWalletAddress(walletAddress.substring(0, memoIndex));
        setDescriptions([
          { id: 1, text: "COIN_DEPOSIT_DESCRIPTION" },
          { id: 2, text: "COIN_DEPOSIT_MIN_DESCRIPTION" },
          { id: 3, text: "COIN_DEPOSIT_DESCRIPTION_MEMO" },
        ]);
      } else if (tagIndex !== -1) {
        setIsTag(walletAddress.substring(tagIndex + 1));
        setVisibleWalletAddress(walletAddress.substring(0, tagIndex));
        setDescriptions([
          { id: 1, text: "COIN_DEPOSIT_DESCRIPTION" },
          { id: 2, text: "COIN_DEPOSIT_DESCRIPTION_TAG" },
        ]);
      } else {
        setVisibleWalletAddress(walletAddress);
      }
    }

    // const memoIndex = destinationTag.indexOf("memoId=");
    // const tagIndex = destinationTag.indexOf("tagId=");
    //
    // if (memoIndex !== -1) {
    //   // setIsMeMo(destinationTag.substring(destinationTag.indexOf("=") + 1));
    //   setIsMeMo(destinationTag);
    //   setDescriptions([
    //     { id: 1, text: "COIN_DEPOSIT_DESCRIPTION" },
    //     { id: 2, text: "COIN_DEPOSIT_MIN_DESCRIPTION" },
    //     { id: 2, text: "COIN_DEPOSIT_DESCRIPTION_MEMO" },
    //   ]);
    //
    // } else if (tagIndex !== -1) {
    //   // setIsMeMo(destinationTag.substring(destinationTag.indexOf("=") + 1));
    //   setIsMeMo(destinationTag);
    //   setDescriptions([
    //     { id: 1, text: "COIN_DEPOSIT_DESCRIPTION" },
    //     { id: 2, text: "COIN_DEPOSIT_DESCRIPTION_TAG" },
    //   ]);
    // }
  }, [walletAddress]);

  useEffect(() => {
    if (destinationTag) {
      const memoIndex = destinationTag.indexOf("memoId=");
      const tagIndex = destinationTag.indexOf("dt=");

      if (memoIndex !== -1) {
        setIsMeMo(destinationTag);
        setDescriptions([
          { id: 1, text: "COIN_DEPOSIT_DESCRIPTION" },
          { id: 2, text: "COIN_DEPOSIT_MIN_DESCRIPTION" },
          { id: 3, text: "COIN_DEPOSIT_DESCRIPTION_MEMO" },
        ]);

      } else if (tagIndex !== -1) {
        setIsMeMo(destinationTag);
        setDescriptions([
          { id: 1, text: "COIN_DEPOSIT_DESCRIPTION" },
          { id: 2, text: "COIN_DEPOSIT_DESCRIPTION_TAG" },
        ]);
      }
    }
  }, [destinationTag]);

  useEffect(() => {
    if (networks.length >= 1 && Object.keys(networkInstance).length <= 1) {
      const storedWallet = networks[0].WalletAddress;
      if (storedWallet) {
        setVisibleWalletAddress(storedWallet);
        setWalletAddress(storedWallet);
        // setNetworkInstance(networks[0]);
        // setActiveNetwork(networks[0].Id);
        // setActiveNetworkName(networks[0].CoinNetwork);
        // setDestinationTag(networks[0].DestinationTag);
      } else {
        setActiveNetwork("");
        setActiveNetworkName("");
        setDestinationTag("");

        // setActiveNetworkName(networks[0].CoinNetwork);
        // setDestinationTag(networks[0].DestinationTag);
      }

      setNetworkInstance(networks[0]);
      setActiveNetwork(networks[0].Id);
      setActiveNetworkName(networks[0].CoinNetwork);
      setDestinationTag(networks[0].DestinationTag);
    }
  }, [networks]);

  useEffect(() => {
    if (activeNetwork) {
      setWalletAddress("");
      const theNetwork = networks.find(net => net.Id === activeNetwork);
      if (theNetwork && theNetwork.WalletAddress) {
        setFetching(false);
        setWalletAddress(theNetwork.WalletAddress);
      } else {
        setFetching(false);
        setWalletAddress("");
        setVisibleWalletAddress("");
      }
    }
  }, [activeNetwork]);

  const createWallet = (activeNetwork) => {
    if ((!activeNetwork && activeNetwork !== 0) || !wallet || !wallet.gd)
      return null;

    // loadingButton.current?.showLoading(true);
    setFetching(true);
    setWalletAddress("");
    walletServices.create({ CoinGuid: wallet.gd, NetworkId: activeNetwork }, false)
      .then((response) => {
        setFetching(false);
        // loadingButton.current?.showLoading(false);
        if (response && response.IsSuccess) {
          setError(false);
          setWalletAddress(response.Data);

          // TODO APPEND WALLET ADDRESS ON NETWORKS ARRAY

          setNetworks(
            networks.map(item =>
              item.Id === activeNetwork
                ? { ...item, WalletAddress: response.Data }
                : item,
            ));

        } else {
          setError(true);
        }
      });
  };

  const handleCreateWallet = () => createWallet(activeNetwork);

  const handleAction = (type) => {
    if (!visibleWalletAddress) {
      return;
    }
    if (type === "copy") {
      Clipboard.setString(visibleWalletAddress);
      DropdownAlert.show("success", getLang(language, "INFORMATION"), getLang(language, "WALLET_ADDRESS_COPIED"));
    }
    if (type === "qr") {
      if (walletAddress) {
        ModalProvider.show(() => <QrCreateModalize qrValue={walletAddress} />);
      } else {
        DropdownAlert.show("info", getLang(language, "ERROR"), getLang(language, "AN_UNKNOWN_ERROR_OCCURED"));
      }
    }
  };

  return (
    <>
      <View style={styles.container}>

        <KeyboardAwareScrollView
          extraScrollHeight={200}
          enableAutomaticScroll={true}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}>

          <InfoCard wallet={wallet}
                    onPress={showModal}
          />


          <BigInput
            smallTitle={getLang(language, "WALLET_ADDRESS")}
            inputValue={
              visibleWalletAddress ? visibleWalletAddress :
                (!activeNetwork && activeNetwork !== 0) && networks.length >= 1 ? getLang(language, "PLEASE_SELECT_NETWORK")
                  : getLang(language, error ? "AN_UNKNOWN_ERROR_OCCURED" : fetching ? "WALLET_IS_CREATING" : "PRESS_BUTTON_TO_CREATE_WALLET")
            }
            handleAction={handleAction} />

          {
            isMemo && isMemo !== "" ? <BigInput
              smallTitle={getLang(language, "MEMO_ID")}
              inputValue={isMemo}
              actionAble={false}
              handleAction={handleAction} /> : null
          }


          {
            isTag && isTag !== "" ? <BigInput
              smallTitle={getLang(language, "DESTINATION_TAG")}
              inputValue={isTag}
              actionAble={false}
              handleAction={handleAction} /> : null
          }

          <Networks activeNetwork={activeNetwork}
                    networks={networks}
                    onSelect={(val, name, network) => {
                      setNetworkInstance(network);
                      setActiveNetwork(val);
                      setActiveNetworkName(name);
                    }}
          />


          <View style={styles.qr}>

            {
              error ?
                <EmptyContainer
                  text={getLang(language, "AN_UNKNOWN_ERROR_OCCURED")} /> : visibleWalletAddress && !fetching ?
                  <QrResult value={visibleWalletAddress} size={(SCREEN_WIDTH / 2) - (PADDING_H * 2)} />
                  : fetching && <PulseAnimation market={wallet.cd} />

            }
          </View>


          {
            walletAddress ? <TransactionDescriptions
              isNormal={false}
              o1={"NETWORK"}
              n1={activeNetworkName}
              o2={"COINNAME"}
              n2={wallet.cd}
              o3={"AMOUNT"}
              n3={networkInstance.WithdrawMinLimit + " " + wallet.cd}
              descriptions={descriptions} /> : null
          }


        </KeyboardAwareScrollView>


      </View>

      {
        !visibleWalletAddress && !fetching &&
        <CustomButton text={getLang(language, "CREATE_WALLET")}
                      filled={true}
                      style={{ backgroundColor: activeTheme.actionColor }}
                      onPress={handleCreateWallet} />
      }


    </>

  );

};


export default DepositBtcScreen;

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: PADDING_H,
    paddingBottom: 100,
  },
  container: {
    flex: 1,
  },
  qr: {
    paddingVertical: PADDING_H * 2,
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
    minHeight: (SCREEN_WIDTH / 2) - (PADDING_H * 2),
  },

});
