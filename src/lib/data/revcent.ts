import { redirect } from "next/navigation"
import { RedirectType } from "next/dist/client/components/redirect"
import { initiatePaymentSession } from "./cart"
import { removeCartId } from "./cookies"

export const handleRevcentOfflineForm = async (provider_id: string, cart: any) => {
  
    try {
      const res = await initiatePaymentSession(cart, {
        provider_id,
        context: {
          customer: cart?.customer,
          email: cart?.customer?.email,

        },
      })
  
      console.log("res from revcent offline_payment: ", res)
      return res
    } catch (error) {
      console.log("error", error)
    }
  }
  