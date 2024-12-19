"use client"

import { Button } from "@medusajs/ui"
import React, { PropsWithChildren, useTransition } from "react"

type Props = {} & PropsWithChildren

const SubmitButton = ({ children, ...props }: Props) => {
  const [isPending, startTransition] = useTransition()

  return (
    // @ts-ignore
    <Button {...props} disabled={isPending}>
      {/* @ts-ignore */}
      {children}
    </Button>
  )
}

export default SubmitButton
