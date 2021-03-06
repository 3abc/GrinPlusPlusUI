import {
  Content,
  Flex,
  HorizontallyCenter,
  Right,
  Title,
} from "../../components/styled";
import React, { useCallback } from "react";
import { useStoreActions, useStoreState } from "../../hooks";

import { Intent, Position, Toaster, Button } from "@blueprintjs/core";

import { useTranslation } from "react-i18next";
import { ReceiveUsingSlatepackComponent } from "../../components/transaction/receive/ReceiveUsingSlatepack";
import { SlatepackComponent } from "../../components/extras/Slatepack";
import { validateSlatepack } from "../../services/utils";

export const ReceiveContainer = () => {
  const { t } = useTranslation();

  const { slatepack, returnedSlatepack } = useStoreState(
    (actions) => actions.receiveCoinsModel
  );
  const { walletReachable } = useStoreState((actions) => actions.walletSummary);

  const {
    setSlatepack,
    receiveTxViaSlatepack,
    setReturnedSlatepack,
  } = useStoreActions((actions) => actions.receiveCoinsModel);

  const { address: onionAddress, slatepackAddress } = useStoreState(
    (state) => state.session
  );

  const onReceiveSlatepack = useCallback(
    (slatepack: string) => {
      require("electron-log").info("Receiving Slatepack...");
      receiveTxViaSlatepack(slatepack).then(
        (result: { error: string; slatepack: string }) => {
          require("electron-log").info(result);
          if (result.slatepack.trim().length > 0) {
            Toaster.create({ position: Position.BOTTOM }).show({
              message: t("received"),
              intent: Intent.SUCCESS,
              icon: "tick-circle",
            });

            setReturnedSlatepack(result.slatepack);
          } else {
            Toaster.create({ position: Position.BOTTOM }).show({
              message: result.error,
              intent: Intent.DANGER,
              icon: "warning-sign",
            });
          }
        }
      );
    },
    [receiveTxViaSlatepack, t, setReturnedSlatepack]
  );

  return (
    <Content>
      <div style={{ margin: "15px" }}>
        <Flex>
          <div style={{ width: "48%" }}>
            <ReceiveUsingSlatepackComponent
              slate={slatepack}
              onReceiveSlatepackButtonCb={onReceiveSlatepack}
              setSlatepackTextCb={setSlatepack}
            />
          </div>
          <div style={{ width: "48%" }}>
            <Flex>
              <Title>{t("response")}</Title>
              <Right>
                <Button
                  disabled={!validateSlatepack(returnedSlatepack)}
                  intent={Intent.SUCCESS}
                  minimal={true}
                  text={t("copy_to_clipboard")}
                  onClick={() => {
                    navigator.clipboard.writeText(returnedSlatepack);
                    Toaster.create({ position: Position.BOTTOM }).show({
                      message: (
                        <div style={{ color: "white" }}>{t("copied")}</div>
                      ),
                      intent: Intent.SUCCESS,
                    });
                  }}
                />
              </Right>
            </Flex>
            <div style={{ marginTop: "5px", marginBottom: "5px" }}>
              <SlatepackComponent slatepack={returnedSlatepack} />
            </div>
            <HorizontallyCenter>
              <p
                style={{ color: "#a3a3a3", fontSize: "13px", marginTop: "5px" }}
              >
                {t("share_to_finalize_transaction")}
              </p>
            </HorizontallyCenter>
          </div>
        </Flex>
        <div>
          <Title>{t("address")}</Title>
          <br />
          <Button
            onClick={() => {
              navigator.clipboard.writeText(slatepackAddress);
              Toaster.create({ position: Position.BOTTOM }).show({
                message: <div style={{ color: "white" }}>{t("copied")}</div>,
                intent: Intent.SUCCESS,
              });
            }}
            style={{
              margin: "5px",
            }}
            minimal={true}
            className="bp3-dark"
            intent={
              walletReachable === undefined
                ? Intent.NONE
                : walletReachable
                ? Intent.SUCCESS
                : Intent.WARNING
            }
            text={slatepackAddress}
          />
          <br />
          <Button
            onClick={() => {
              navigator.clipboard.writeText(
                `http://${onionAddress}.grinplusplus.com/`
              );
              Toaster.create({ position: Position.BOTTOM }).show({
                message: <div style={{ color: "white" }}>{t("copied")}</div>,
                intent: Intent.SUCCESS,
              });
            }}
            style={{
              margin: "5px",
            }}
            minimal={true}
            className="bp3-dark"
            intent={
              walletReachable === undefined
                ? Intent.NONE
                : walletReachable
                ? Intent.SUCCESS
                : Intent.WARNING
            }
            text={`http://${onionAddress}.grinplusplus.com/`}
          />
        </div>
      </div>
    </Content>
  );
};
