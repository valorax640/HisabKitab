package com.hisabkitab

import android.content.Context
import android.telephony.SubscriptionInfo
import android.telephony.SubscriptionManager
import android.telephony.TelephonyManager
import android.os.Build
import androidx.annotation.RequiresApi
import com.facebook.react.bridge.*

class SimInfoModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    override fun getName(): String = "SimInfo"

    @ReactMethod
    fun getSimInfo(promise: Promise) {
        try {
            val subscriptionManager = reactApplicationContext.getSystemService(Context.TELEPHONY_SUBSCRIPTION_SERVICE) as SubscriptionManager
            val telephonyManager = reactApplicationContext.getSystemService(Context.TELEPHONY_SERVICE) as TelephonyManager

            val simData = Arguments.createArray()
            val subscriptionInfoList = subscriptionManager.activeSubscriptionInfoList

            subscriptionInfoList?.forEach { info ->
                val sim = Arguments.createMap()
                sim.putString("number", info.number ?: "")
                sim.putInt("slotIndex", info.simSlotIndex)
                sim.putString("carrierName", info.carrierName.toString())
                simData.pushMap(sim)
            }

            promise.resolve(simData)
        } catch (e: Exception) {
            promise.reject("SIM_ERROR", "Failed to get SIM info", e)
        }
    }
}
