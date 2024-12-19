"use server"

import { redirect, RedirectType } from "next/navigation"
import { initiatePaymentSession } from "./cart"
import { removeCartId } from "./cookies"

export const handlePagbankCCForm = async (
  provider_id: string,
  cart: any,
  formData: any
) => {
  console.log("provider_id", provider_id)
  try {
    const res = await initiatePaymentSession(
      cart,
      {
        provider_id,
        context: {
          customer: cart?.customer,
          email: cart?.customer?.email,
        },
      },
      {
        payment_info: {
          card: {
            encrypted: formData.encrypted,
            holder: { name: formData.holder },
          },
        },
      }
    )

    console.log("res from pagbank cc: ", res)

    return res
  } catch (error) {}
}

export const handlePagbankBoletoForm = async (
  provider_id: string,
  cart: any,
  formData: any
) => {
  console.log("provider_id", provider_id)

  try {
    const res = await initiatePaymentSession(
      cart,
      {
        provider_id,
        context: {
          customer: cart?.customer,
          email: cart?.customer?.email,
        },
      },
      {
        payment_info: {
          tax_id: formData.tax_id,
        },
      }
    )

    console.log("res from pagbank Boleto: ", res)

    if (res) {
      console.log("redirecting to ", `/order/boleto/${cart?.id}`)
      try {
        console.log("redirecting...")

        redirect(`/order/boleto/${cart?.id}`, RedirectType.push)
      } catch (error) {
        console.log("redirecting failed")
        console.log(error)
      }
      await removeCartId()

      return { ...res, cartId: cart.id }
    }
  } catch (error) {}
}

export const handlePagbankPixForm = async (provider_id: string, cart: any) => {
  console.log("provider_id", provider_id)

  try {
    const res = await initiatePaymentSession(cart, {
      provider_id,
      context: {
        customer: cart?.customer,
        email: cart?.customer?.email,
      },
    })

    console.log("res from pagbank PIX: ", res)

    if (res) {
      console.log("redirecting to ", `/order/pix/${cart?.id}`)
      try {
        redirect(`/order/pix/${cart?.id}`, RedirectType.push)
      } catch (error) {
        console.log("error")
      }
      await removeCartId()
      return { ...res, cartId: cart.id }
    }
  } catch (error) {
    console.log("error", error)
  }
}
