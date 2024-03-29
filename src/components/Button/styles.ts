import styled, { css } from "styled-components/native";
import { RectButton } from "react-native-gesture-handler";

export type TypeProps = "primary" | "secondary";

type ContainerProps = {
  type: TypeProps;
};

export const Container = styled.TouchableOpacity<ContainerProps>`
  flex: 1;
  max-height: 56px;
  min-height: 56px;
  border-radius: 12px;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme, type }) =>
    type === "primary" ? theme.COLORS.PRIMARY_900 : theme.COLORS.SUCCESS_900};
`;

export const Title = styled.Text`
  font-size: 16px;

  ${({ theme }) => css`
    color: ${theme.COLORS.TITLE};
    font-family: ${theme.FONTS.TEXT};
  `}
`;

export const Loading = styled.ActivityIndicator.attrs(({ theme }) => ({
  color: theme.COLORS.TITLE
}))``;
