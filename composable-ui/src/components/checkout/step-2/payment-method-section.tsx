import {
  Box,
  Icon,
  Text,
  Stack,
  Code,
} from '@chakra-ui/react'
import { useIntl } from 'react-intl'
import { IoCardOutline } from 'react-icons/io5'
import { useCheckout } from '../../../hooks'
import { SectionHeader } from '@composable/ui'
import { PaymentElement } from '@stripe/react-stripe-js'
import { useEffect } from 'react'
import { BsCashCoin } from 'react-icons/bs'
import { FormBillingAddress } from './form-billing-address'
import { OfflinePayment } from './offline-payment'
import { PAYMENT_METHOD } from '../constants'
import { memo } from 'react'

const SetYourStripeAccount = () => (
  <Stack bg={'info.200'} padding={4}>
    <Text textStyle={'Desktop/Body-L'}>
      To use Stripe, add your own Stripe keys to `.env`
    </Text>
    <Code>
      <Text>STRIPE_SECRET_KEY=sk_test_...</Text>
      <Text>NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...</Text>
    </Code>
  </Stack>
)

interface PaymentMethodSectionProps {
  stripeError?: boolean
}

export const PaymentMethodSection = memo(function PaymentMethodSection({
  stripeError = false,
}: PaymentMethodSectionProps) {
  const intl = useIntl()
  const {
    paymentHandler: { register, select },
  } = useCheckout()
  const stripeAvailable =
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY && !stripeError

  useEffect(() => {
    register({
      key: PAYMENT_METHOD.STRIPE,
      title: intl.formatMessage({
        id: 'checkout.paymentSection.stripe.paymentMethodTitle',
      }),
      icon: IoCardOutline,
    })
  }, [intl, register])

  return (
    <Box>
      <SectionHeader>Credit Card</SectionHeader>
      <Box bg="shading.100" p="sm">
        {stripeAvailable ? (
          <PaymentElement />
        ) : (
          <SetYourStripeAccount />
        )}
        <BillingAddressSubsection />
      </Box>
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
