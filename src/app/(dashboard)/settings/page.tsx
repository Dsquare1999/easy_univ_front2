import AboutMe from "@/components/AboutMe";
import BillingHistory from "@/components/BillingHistory";
import MyDetails from "@/components/MyDetails";
import MyStatut from "@/components/MyStatut";
import Password from "@/components/Password";
import PaymentMethods from "@/components/PaymentMethods";
import SettingHeader from "@/components/SettingHeader";

const Settings = () => {

    return ( 
        <section>
            <div className="dashboard-body">
            <div className="breadcrumb mb-24">
                <ul className="flex-align gap-4">
                    <li><a href="index.html" className="text-gray-200 fw-normal text-15 hover-text-main-600">Home</a></li>
                    <li> <span className="text-gray-500 fw-normal d-flex"><i className="ph ph-caret-right"></i></span> </li>
                    <li><span className="text-main-600 fw-normal text-15">Setting</span></li>
                </ul>
            </div>
             
            <div className="card overflow-hidden">
                <SettingHeader  />
            </div>

            <div className="tab-content" id="pills-tabContent">
                <div className="tab-pane fade show active" id="pills-details" role="tabpanel" aria-labelledby="pills-details-tab" tabIndex={0}>
                    <MyDetails />
                </div>
                
                <div className="tab-pane fade" id="pills-profile" role="tabpanel" aria-labelledby="pills-profile-tab" tabIndex={0}>
                    <AboutMe /> 
                </div>

                <div className="tab-pane fade" id="pills-password" role="tabpanel" aria-labelledby="pills-password-tab" tabIndex={0}>
                    <Password />
                </div>

                <div className="tab-pane fade" id="pills-plan" role="tabpanel" aria-labelledby="pills-plan-tab" tabIndex={0}>
                    <MyStatut />
                </div>

                <div className="tab-pane fade" id="pills-billing" role="tabpanel" aria-labelledby="pills-billing-tab" tabIndex={0}>
                    <PaymentMethods />

                    <BillingHistory />
                </div>

            </div>
        </div>
        </section>
     );
}
 
export default Settings;