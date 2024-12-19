import { retrieveCart } from "@lib/data/cart"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import { CheckCircle } from "@medusajs/icons"
import Boleto from "@modules/order/boleto"

export const metadata: Metadata = {
  title: `Boleto Payment`,
  description: "Boleto Payment Page",
}

type Props = {
  params: { cart_id: string }
}

const PixPaymentPage = async ({ params: { cart_id } }: Props) => {
  const cart = await retrieveCart(cart_id)

  if (!cart) {
    return notFound()
  }

  const barcode =
    (cart?.payment_collection?.payment_sessions?.[0]?.data as any)?.charges?.[0]
      ?.payment_method?.boleto?.barcode ?? null
  // const formatted_barcode =
  //   (cart?.payment_session?.data as any)?.charges?.[0]?.payment_method?.boleto
  //     ?.formatted_barcode ?? ""

  return (
    <div className="flex flex-col justify-center gap-8 max-w-[680px] mx-auto sm:p-10 px-2 py-10">
      <h1 className="text-3xl self-center">Gratidão</h1>
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
      {barcode && (
        <Boleto barcode={barcode} cart={cart as any} variant="payment" />
      )}
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
