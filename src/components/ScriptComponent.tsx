"use client"
import Script from "next/script";
import { useEffect } from "react";

const ScriptComponent = () => {
    useEffect(() => {
        if (typeof window !== "undefined") {
            window.$ = window.jQuery = require("jquery");

            setTimeout(() => {
                const scriptsToLoad = [
                    "/assets/js/main.js",
                ];

                scriptsToLoad.forEach(src => {
                    const script = document.createElement("script");
                    script.src = src;
                    script.async = true;
                    document.body.appendChild(script);
                });
            }, 1500);
        }
      }, []);

    return ( 
        <>
            <link rel="shortcut icon" href="/assets/images/logo/favicon.png" />
            <link rel="stylesheet" href="/assets/css/file-upload.css" />
            <link rel="stylesheet" href="/assets/css/plyr.css" />
            <link rel="stylesheet" href="/assets/css/full-calendar.css" />
            <link rel="stylesheet" href="/assets/css/jquery-ui.css" />
            <link rel="stylesheet" href="/assets/css/apexcharts.css" />
            <link rel="stylesheet" href="/assets/css/calendar.css" />
            <link rel="stylesheet" href="/assets/css/jquery-jvectormap-2.0.5.css" />
            <link rel="stylesheet" href="/assets/css/main.css" />

            <link rel="stylesheet" type="text/css" href="https://unpkg.com/@phosphor-icons/web@2.1.1/src/regular/style.css" />
            <link rel="stylesheet" type="text/css" href="https://unpkg.com/@phosphor-icons/web@2.1.1/src/thin/style.css" />
            <link rel="stylesheet" type="text/css" href="https://unpkg.com/@phosphor-icons/web@2.1.1/src/light/style.css" />
            <link rel="stylesheet" type="text/css" href="https://unpkg.com/@phosphor-icons/web@2.1.1/src/bold/style.css" />
            <link rel="stylesheet" type="text/css" href="https://unpkg.com/@phosphor-icons/web@2.1.1/src/fill/style.css" />
            <link rel="stylesheet" type="text/css" href="https://unpkg.com/@phosphor-icons/web@2.1.1/src/duotone/style.css" />


            <Script src="/assets/js/jquery-3.7.1.min.js" strategy="beforeInteractive"  />

            <Script src="/assets/js/file-upload.js" strategy="afterInteractive" />
            <Script src="/assets/js/plyr.js" strategy="afterInteractive" />
            <Script src="/assets/js/full-calendar.js" strategy="afterInteractive" />
            <Script src="/assets/js/jquery-ui.js" strategy="afterInteractive" />
            <Script src="/assets/js/apexcharts.min.js" strategy="afterInteractive" />
            <Script src="/assets/js/calendar.js" strategy="afterInteractive" />
            <Script src="/assets/js/jquery-jvectormap-2.0.5.min.js" strategy="afterInteractive" />
            {/* <Script src="/assets/js/main.js" strategy="afterInteractive" /> */}
            <Script src="/assets/js/boostrap.bundle.min.js" strategy="afterInteractive" />


        </>
     );
}
 
export default ScriptComponent;
