import React, { useState, useEffect } from "react";
import { Alert, Platform } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import firestore from "@react-native-firebase/firestore";

import { useAuth } from "../../hooks/auth";

import { RadioButton } from "../../components/RadioButton";
import { BackButton } from "../../components/BackButton";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { ProductProps } from "../../components/ProductCard";
import { OrderNavigationProps } from "../../@types/navigation";

import { PIZZA_TYPES } from "../../utils/pizzaTypes";

import * as S from "./styles";

type PizzaResponse = ProductProps & {
  prices_sizes: {
    [key: string]: number;
  };
};

export function Order() {
  const { user } = useAuth();
  const [size, setSize] = useState("");
  const [pizza, setPizza] = useState<PizzaResponse>({} as PizzaResponse);
  const [quantity, setQuantity] = useState(0);
  const [tableNumber, setTableNumber] = useState("");
  const [sendingOrder, setSendingOrder] = useState(false);

  const navigation = useNavigation();

  const route = useRoute();
  const { id } = route.params as OrderNavigationProps;

  const amount = size ? pizza.prices_sizes[size] * quantity : "0,00";

  useEffect(() => {
    if (id) {
      firestore()
        .collection("pizzas")
        .doc(id)
        .get()
        .then((response) => {
          setPizza(response.data() as PizzaResponse);
        })
        .catch(() =>
          Alert.alert("Pedido", "Não foi possível carregar o produto")
        );
    }
  }, [id]);

  async function handleOrder() {
    if (!size) {
      return Alert.alert("Pedido", "Selecione o tamanho da pizza");
    }

    if (!tableNumber) {
      return Alert.alert("Pedido", "Informe o número da mesa");
    }

    if (!quantity) {
      return Alert.alert("Pedido", "Informe a quantidade");
    }

    setSendingOrder(true);

    firestore()
      .collection("orders")
      .add({
        quantity,
        amount,
        pizza: pizza.name,
        size,
        table_number: tableNumber,
        status: "Preparando",
        waiter_id: user?.id,
        image: pizza.photo_url
      })
      .then(() => navigation.navigate("home"))
      .catch(() => {
        Alert.alert("Pedido", "Não foi possível realziar o pedido");
        setSendingOrder(false);
      });
  }

  function handlegoBack() {
    navigation.goBack();
  }

  return (
    <S.Container behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <S.ContentScroll>
        <S.Header>
          <BackButton onPress={handlegoBack} style={{ marginBottom: 108 }} />
        </S.Header>
        <S.Photo source={{ uri: pizza?.photo_url }} />

        <S.Form>
          <S.Title>{pizza.name}</S.Title>
          <S.Label>Selecione um tamanho</S.Label>
          <S.Sizes>
            {PIZZA_TYPES.map((item) => (
              <RadioButton
                key={item.id}
                title={item.name}
                onPress={() => setSize(item.id)}
                selected={size === item.id}
              />
            ))}
          </S.Sizes>

          <S.FormRow>
            <S.InputGroup>
              <S.Label>Número da mesa</S.Label>
              <Input keyboardType="numeric" onChangeText={setTableNumber} />
            </S.InputGroup>

            <S.InputGroup>
              <S.Label>Quantidade</S.Label>
              <Input
                keyboardType="numeric"
                onChangeText={(value) => setQuantity(Number(value))}
              />
            </S.InputGroup>
          </S.FormRow>

          <S.Price>Valor de R$ {amount}</S.Price>

          <Button
            title="Confirmar pedido"
            type="secondary"
            isLoading={sendingOrder}
            onPress={handleOrder}
          />
        </S.Form>
      </S.ContentScroll>
    </S.Container>
  );
}
