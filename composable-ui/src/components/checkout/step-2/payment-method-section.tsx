import {
  Accordion,
  AccordionItem,
  AccordionPanel,
  Box,
  Icon,
  Text,
  Stack,
  Code,
} from '@chakra-ui/react';
import { useIntl } from 'react-intl';
import { IoCardOutline } from 'react-icons/io5';
import { useCheckout } from '../../../hooks';
import { SectionHeader } from '@composable/ui';
import { FormBillingAddress } from './form-billing-address';
import { PaymentElement } from '@stripe/react-stripe-js';
import { useEffect } from 'react';
import { memo } from 'react';

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
);

interface PaymentMethodSectionProps {
  stripeError?: boolean;
}

export const PaymentMethodSection = memo(function PaymentMethodSection({
  stripeError = false,
}: PaymentMethodSectionProps) {
  const intl = useIntl();
  const { paymentHandler: { register, list } = useCheckout();
  const stripeAvailable =
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY && !stripeError;

  // Only register the Stripe payment method
  useEffect(() => {
    register({
      key: PAYMENT_METHOD.STRIPE,
      title: intl.formatMessage({
        id: 'checkout.paymentSection.stripe.paymentMethodTitle',
      }),
      icon: IoCardOutline,
    });
  }, [intl, register]);

  return (
    <Box>
      <Accordion allowToggle defaultIndex={[0]}>
        {list
          .filter((pmtMethod) => pmtMethod.key === PAYMENT_METHOD.STRIPE) // Show Stripe only
          .map((pmtMethod) => (
            <AccordionItem
              key={pmtMethod.key}
              isDisabled={!stripeAvailable} // Disable if Stripe is unavailable
            >
              <AccordionPanel px={0} pb={0}>
                <Box bg="shading.100" p="sm">
                  {!stripeAvailable ? (
                    <SetYourStripeAccount />
                  ) : (
                    <PaymentElement />
                  )}
                  <BillingAddressSubsection />
                </Box>
              </AccordionPanel>
            </AccordionItem>
          ))}
      </Accordion>
    </Box>
  );
});

const BillingAddressSubsection = () => {
  const intl = useIntl();
  const { checkoutState, setCheckoutState } = useCheckout();
  const {
    config: { billingSameAsShipping },
  } = checkoutState;

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
            return;
          }

          setCheckoutState((state) => {
            return {
              ...state,
              billing_address: data,
            };
          });
        }}
      />
    </Box>
  );
};
