import { handlePagbankBoletoForm } from "@lib/data/pagbank"
import { Button, Input, Label } from "@medusajs/ui"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"

const PagBankPaymentBoletoButton = ({
  valid,
  provider_id,
  cart,
}: {
  valid: boolean
  provider_id: string
  cart: any
}) => {
  const {
    register,
    handleSubmit,
    formState: { isLoading, isSubmitting },
  } = useForm<{ tax_id: string }>({
    defaultValues: {
      tax_id: cart?.billing_address?.metadata?.cpf,
    },
  }) // Initialize useForm

  const router = useRouter()

  const onSubmit = async (data: any) => {
    // Define onSubmit function
    const res = await handlePagbankBoletoForm(provider_id, cart, {
      tax_id: data.tax_id,
    })

    if (res) {
      console.log("redirecting...")

      router.push(`/order/boleto/${cart?.id}`)
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-md p-6 bg-white rounded-md border space-y-6"
    >
      <h2 className="text-xl font-semibold mb-4">Boleto Payment</h2>
      <div>
        {/* @ts-ignore */}
        <Label htmlFor="tax_id">CPF/CNPJ</Label>
        {/* @ts-ignore */}
        <Input
          {...register("tax_id")}
          autoComplete="tax_id"
          placeholder="Enter Tax ID CPF/CNPJ"
        />
      </div>
      {/* @ts-ignore */}
      <Button
        type="submit"
        className="w-full"
        disabled={isLoading || isSubmitting}
      >
        {isLoading || isSubmitting ? "Loading..." : "Payment With Boleto"}
      </Button>
    </form>
  )
}

export default PagBankPaymentBoletoButton
