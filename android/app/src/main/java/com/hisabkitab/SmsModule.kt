package com.hisabkitab

import android.content.Context
import android.telephony.SmsManager
import android.telephony.SubscriptionManager
import android.util.Log
import com.facebook.react.bridge.*

class SmsModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "SmsModule"

    @ReactMethod
    fun sendSmsFromSim(slotIndex: Int, phoneNumber: String, message: String, promise: Promise) {
        try {
            val subManager = reactApplicationContext.getSystemService(Context.TELEPHONY_SUBSCRIPTION_SERVICE) as SubscriptionManager
            val subscriptionInfoList = subManager.activeSubscriptionInfoList

            if (subscriptionInfoList != null && subscriptionInfoList.size > slotIndex) {
                val subId = subscriptionInfoList[slotIndex].subscriptionId
                val smsManager = SmsManager.getSmsManagerForSubscriptionId(subId)
                smsManager.sendTextMessage(phoneNumber, null, message, null, null)
                promise.resolve("SMS sent from SIM slot $slotIndex")
            } else {
                promise.reject("INVALID_SLOT", "No SIM in slot $slotIndex")
            }
        } catch (e: Exception) {
            promise.reject("SEND_SMS_ERROR", e.message)
        }
    }
}
