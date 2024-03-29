import React from "react";

import * as S from "./styles";

type BottomMenuProps = {
  title: string;
  color: string;
  notifications?: string | undefined;
};

export function BottomMenu({ title, color, notifications }: BottomMenuProps) {
  const noNotifications = notifications === "0";

  return (
    <S.Container>
      <S.Title color={color}>{title}</S.Title>

      {notifications && (
        <S.Notification noNotifications={noNotifications}>
          <S.Quantity noNotifications={noNotifications}>
            {notifications}
          </S.Quantity>
        </S.Notification>
      )}
    </S.Container>
  );
}
