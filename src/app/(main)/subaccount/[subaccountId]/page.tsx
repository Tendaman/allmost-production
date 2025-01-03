//src\app\(main)\subaccount\[subaccountId]\page.tsx
import BlurPage from '@/components/global/blur-page'
import CircleProgress from '@/components/global/circle-progress'
import PipelineValue from '@/components/global/pipeline-value'
import SubaccountFunnelChart from '@/components/global/subaccount-funnel-chart'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { db } from '@/lib/db'
import { stripe } from '@/lib/stripe'
import { ClipboardIcon, Contact2, DollarSign, ShoppingCart } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import CheckoutActivityChart from '@/components/chart-data/checkout-activity-chart'
import TransitionHistory from '@/components/chart-data/transaction-history'

type Props = {
  params: { subaccountId: string }
  searchParams: {
    code: string
  }
}

const SubaccountPageId = async ({ params, searchParams }: Props) => {
  let currency = 'USD'
  let sessions
  let totalClosedSessions
  let totalPendingSessions
  let net = 0
  let potentialIncome = 0
  let closingRate = 0

  const subaccountDetails = await db.subAccount.findUnique({
    where: {
      id: params.subaccountId,
    },
  })

  const currentYear = new Date().getFullYear()
  const startDate = new Date(`${currentYear}-01-01T00:00:00Z`).getTime() / 1000
  const endDate = new Date(`${currentYear}-12-31T23:59:59Z`).getTime() / 1000

  if (!subaccountDetails) return

  if (subaccountDetails.connectAccountId) {
    const response = await stripe.accounts.retrieve({
      stripeAccount: subaccountDetails.connectAccountId,
    })
    currency = response.default_currency?.toUpperCase() || 'USD'
    const checkoutSessions = await stripe.checkout.sessions.list(
      { created: { gte: startDate, lte: endDate }, limit: 100 },
      {
        stripeAccount: subaccountDetails.connectAccountId,
      }
    )
    sessions = checkoutSessions.data.map((session) => ({
      ...session,
      created: new Date(session.created * 1000).toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false, // Set to true for 12-hour format
      }),
      amount_total: session.amount_total ? parseFloat((session.amount_total / 100).toFixed(2)) : 0, // Ensure amount_total is a number
    }))

    totalClosedSessions = checkoutSessions.data
      .filter((session) => session.status === 'complete')
      .map((session) => ({
        ...session,
        created: new Date(session.created * 1000).toLocaleDateString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        }),
        amount_total: session.amount_total ? session.amount_total / 100 : 0,
      }))

    totalPendingSessions = checkoutSessions.data
      .filter(
        (session) => session.status === 'open' || session.status === 'expired'
      )
      .map((session) => ({
        ...session,
        created: new Date(session.created* 1000).toLocaleDateString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        }),
        amount_total: session.amount_total ? session.amount_total / 100 : 0,
      }))

    net = +totalClosedSessions
      .reduce((total, session) => total + (session.amount_total || 0), 0)
      .toFixed(2)

    potentialIncome = +totalPendingSessions
      .reduce((total, session) => total + (session.amount_total || 0), 0)
      .toFixed(2)

    closingRate = +(
      (totalClosedSessions.length / checkoutSessions.data.length) *
      100
    ).toFixed(2)
  }

  const funnels = await db.funnel.findMany({
    where: {
      subAccountId: params.subaccountId,
    },
    include: {
      FunnelPages: true,
    },
  })

  const funnelPerformanceMetrics = funnels.map((funnel) => ({
    ...funnel,
    totalFunnelVisits: funnel.FunnelPages.reduce(
      (total, page) => total + page.visits,
      0
    ),
  }))


  const chartData = (sessions || []).map((session) => ({
    ...session,
    amount_total: Math.min(session.amount_total || 0), // Cap values
  }));

  return (
    <BlurPage>
      <div className="relative h-full">
        {!subaccountDetails.connectAccountId && (
          <div className="absolute -top-10 -left-10 right-0 bottom-0 z-30 flex items-center justify-center backdrop-blur-md bg-background/50">
            <Card>
              <CardHeader>
                <CardTitle>Connect Your Stripe</CardTitle>
                <CardDescription>
                  You need to connect your stripe account to see metrics
                </CardDescription>
                <Link
                  href={`/subaccount/${subaccountDetails.id}/launchpad`}
                  className="p-2 w-fit bg-blue-500 hover:bg-blue-400 text-white rounded-md flex items-center gap-2"
                >
                  <ClipboardIcon />
                  Launch Pad
                </Link>
              </CardHeader>
            </Card>
          </div>
        )}
        <div className="flex flex-col gap-4 pb-6">
          <div className="flex gap-4 flex-col xl:!flex-row">
            <Card className="flex-1 relative">
              <CardHeader>
                <CardDescription>Income</CardDescription>
                <CardTitle className="text-4xl">
                  {net ? `${currency} ${net.toFixed(2)}` : `$0.00`}
                </CardTitle>
                <small className="text-xs text-muted-foreground">
                  For the year {currentYear}
                </small>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Total revenue generated as reflected in your stripe dashboard.
              </CardContent>
              <DollarSign className="absolute right-4 top-4 text-muted-foreground" />
            </Card>
            <Card className="flex-1 relative">
              <CardHeader>
                <CardDescription>Potential Income</CardDescription>
                <CardTitle className="text-4xl">
                  {potentialIncome
                    ? `${currency} ${potentialIncome.toFixed(2)}`
                    : `$0.00`}
                </CardTitle>
                <small className="text-xs text-muted-foreground">
                  For the year {currentYear}
                </small>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                This is how much you can close.
              </CardContent>
              <Contact2 className="absolute right-4 top-4 text-muted-foreground" />
            </Card>
            <PipelineValue subaccountId={params.subaccountId} />

            <Card className="xl:w-fit">
              <CardHeader>
                <CardDescription>Conversions</CardDescription>
                <CircleProgress
                  value={closingRate}
                  description={
                    <>
                      {sessions && (
                        <div className="flex flex-col">
                          Total Carts Opened
                          <div className="flex gap-2">
                            <ShoppingCart className="text-rose-700" />
                            {sessions.length}
                          </div>
                        </div>
                      )}
                      {totalClosedSessions && (
                        <div className="flex flex-col">
                          Won Carts
                          <div className="flex gap-2">
                            <ShoppingCart className="text-emerald-700" />
                            {totalClosedSessions.length}
                          </div>
                        </div>
                      )}
                    </>
                  }
                />
              </CardHeader>
            </Card>
          </div>

          <div className="flex gap-4 flex-col xl:!flex-row">
            <Card className="relative">
              <CardHeader>
                <CardDescription>Funnel Performance</CardDescription>
              </CardHeader>
              <CardContent className=" text-sm text-muted-foreground flex flex-col gap-12 justify-between ">
                <SubaccountFunnelChart data={funnelPerformanceMetrics} />
                <div className="lg:w-[150px]">
                  Total page visits across all funnels. Hover over to get more
                  details.
                </div>
              </CardContent>
              <Contact2 className="absolute right-4 top-4 text-muted-foreground" />
            </Card>
              <CheckoutActivityChart data={chartData}  />
          </div>
          <div className="flex gap-4 xl:!flex-row flex-col">
          <TransitionHistory totalClosedSessions={totalClosedSessions} currency={currency} />
          </div>
        </div>
      </div>
    </BlurPage>
  )
}

export default SubaccountPageId
