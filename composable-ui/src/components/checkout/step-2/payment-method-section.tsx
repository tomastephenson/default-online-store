import {
  Box,
  Text,
  Stack,
  Code,
} from '@chakra-ui/react'
import { useIntl } from 'react-intl'
import { PaymentElement } from '@stripe/react-stripe-js'
import { useEffect } from 'react'
import { memo } from 'react'
import { useCheckout } from '../../../hooks'
import { SectionHeader } from '@composable/ui'
import { FormBillingAddress } from './form-billing-address'

const SetYourStripeAccount = () => (
  <Stack bg={'info.200'} padding={4}>
    <Text textStyle={'Desktop/Body-L'}>
      To use stripe, add your own stripe keys to `.env`
    </Text>
    <Code>
      <Text>STRIPE_SECRET_KEY=sk_test_...</Text>
      <Text>NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...</Text>
    </Code>
  </Stack>
)

export const PaymentMethodSection = memo(function PaymentMethodSection({
  stripeError = false,
}) {
  const intl = useIntl()
  const {
    paymentHandler: { register, select },
  } = useCheckout()
  const stripeAvailable =
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY && !stripeError

  useEffect(() => {
    register({
      key: 'STRIPE',
      title: intl.formatMessage({
        id: 'checkout.paymentSection.stripe.paymentMethodTitle',
      }),
    })
    // Default to Stripe payment method
    select('STRIPE')
  }, [intl, register, select])

  return (
    <Box>
      {!stripeAvailable ? (
        <SetYourStripeAccount />
      ) : (
        <>
          <PaymentElement />
          <BillingAddressSubsection />
        </>
      )}
    </Box>
  )
})

const BillingAddressSubsection = () => {
  const intl = useIntl()
  const { checkoutState, setCheckoutState } = useCheckout()
  const {
    config: { billingSameAsShipping },
  } = checkoutState

  return (
    <Box mt={8}>
      <SectionHeader
        title={intl.formatMessage({
          id: 'checkout.payment.paymentMethodSection.billingAddressSubsection.title',
        })}
        requiredMarkText={
          billingSameAsShipping
            ? undefined
            : intl.formatMessage({ id: 'section.required' })
        }
        textProps={{ fontSize: 'lg' }}
        boxProps={{ mb: 'sm' }}
      />

      <FormBillingAddress
        initialValues={checkoutState.billing_address}
        onChange={({ data, isValid }) => {
          if (!isValid) {
            return
          }

          setCheckoutState((state) => {
            return {
              ...state,
              billing_address: data,
            }
          })
        }}
      />
    </Box>
  )
}
