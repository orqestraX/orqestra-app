import { Expo, ExpoPushMessage } from 'expo-server-sdk'
import { createAdminClient } from '@/lib/supabase/server'

const expo = new Expo()

export type PushPayload = {
  operatorId: string
  title: string
  body: string
  data?: Record<string, unknown>
}

export async function sendPushNotification(payload: PushPayload): Promise<void> {
  const supabase = createAdminClient()

  // Get stored push tokens for this operator
  const { data: tokens } = await supabase
    .from('push_tokens'
    .select('token')
    .eq('operator_id', payload.operatorId)

  if (!tokens || tokens.length === 0) return

  const messages: ExpoPushMessage[] = tokens
    .filter((t: { token: string }) => Expo.isExpoPushToken(t.token))
    .map(t => ({
      to: t.token,
      sound: 'default' as const,
      title: payload.title,
      body: payload.body,
      data: payload.data ?? {},
    }))

  if (messages.length === 0) return

  const chunks = expo.chunkPushNotifications(messages)
  for (const chunk of chunks) {
    try {
      const receipts = await expo.sendPushNotificationsAsync(chunk)
      // Handle any invalid tokens
      for (const receipt of receipts) {
        if (receipt.status === 'error' && (receipt.details as { error?: string } | undefined)?.error === 'DeviceNotRegistered') {
          // Token is no longer valid — clean it up (fire and forget)
          supabase.from('push_tokens').delete().eq('operator_id', payload.operatorId)
        }
      }
    } catch (err) {
      console.error('[push] Error sending notification:', err)
    }
  }
}
