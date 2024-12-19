import { retrieveCart } from "@lib/data/cart"
import { Metadata } from "next"
import { CheckCircle } from "@medusajs/icons"
import PixQrCode from "@modules/order/pix/pix-qr-code"

export const metadata: Metadata = {
  title: `Pix Payment `,
  description: "Pix Payment",
}

type Props = {
  params: { cart_id: string }
}

const PixPaymentPage = async ({ params: { cart_id } }: Props) => {
  const cart = await retrieveCart(cart_id)

  // <div>{order.shipping_address.metadata.complement}</div>
  //       <div>{order.shipping_address.province}</div>
  //       <div>{order.shipping_address.city}</div>
  // const src =
  //   (cart?.payment_collection?.payment_sessions?.[0]?.data as any)?.qr_codes?.[0]?.links?.[0]?.href ?? ""
  // const text = (cart?.payment_collection?.payment_sessions?.[0]?.data as any)?.qr_codes?.[0]?.text ?? ""
  // console.debug({ src, text })
  // console.debug({ session: cart?.payment_session })

  return (
    <div className="flex flex-col justify-center gap-8 max-w-[680px] mx-auto sm:p-10 px-2 py-10">
      <h1 className="text-3xl self-center">Estávamos te esperando!</h1>
      <div className="flex gap-2 items-start">
        <p className="w-12 aspect-square rounded-full border-2 border-green flex items-center justify-center text-green">
          <CheckCircle />
        </p>
        <div>
          <p className="opacity-50">Pedido #orderNumber</p>
          <p className="text-2xl">
            {
              (cart?.payment_collection?.payment_sessions?.[0]?.data as any)
                .customer?.name
            }
            , seu pedido foi recebido com sucesso
          </p>
        </div>
      </div>
      <PixQrCode cart={cart} variant="payment" />
      {/* <OrderUserData cart={cart} />
      <div className="flex flex-col gap-4 p-5 bg-white rounded-2xl">
        <p className="text-2xl">Detalhes do pedido</p>
        <OrderItems cart={cart} />
        <OrderTotals cart={cart} />
      </div>
      <OrderConfirmationMessage email={cart?.email} /> */}
    </div>
  )
}

export default PixPaymentPage
