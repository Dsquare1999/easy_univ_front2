const BillingHistory = () => {
    return ( 
        <div className="card mt-24">
                        <div className="card-header border-bottom">
                            <div className="flex-between flex-wrap  gap-16">
                                <div>
                                    <h4 className="mb-4">Billing History</h4>
                                    <p className="text-gray-600 text-15">See the transaction you made</p>
                                </div>
                                <div className="flex-align flex-wrap justify-content-end gap-8">
                                    <button type="button" className="toggle-search-btn btn btn-outline-main bg-main-100 border-main-100 text-main-600 rounded-pill py-9">Add Filter</button>
                                    <button type="button" className="btn btn-main rounded-pill py-9">Download All</button>
                                </div>
                            </div>
                        </div>
                        
                        <div className="card toggle-search-box border-bottom border-gray-100 rounded-0">
                            <div className="card-body">
                                <form action="#" className="search-input-form">
                                    <div className="search-input">
                                        <select className="form-control form-select h6 rounded-4 mb-0 py-6 px-8">
                                            <option value="" selected disabled>Invoice Type</option>
                                            <option value="">Credit Invoice</option>
                                            <option value="">Debit Invoice</option>
                                            <option value="">Mixed Invoice</option>
                                            <option value="">Commercial Invoice</option>
                                        </select>
                                    </div>
                                    <div className="search-input">
                                        <select className="form-control form-select h6 rounded-4 mb-0 py-6 px-8">
                                            <option value="" selected disabled>amount</option>
                                            <option value="">1</option>
                                            <option value="">2</option>
                                            <option value="">3</option>
                                        </select>
                                    </div>
                                    <div className="search-input">
                                        <input type="date" className="form-control form-select h6 rounded-4 mb-0 py-6 px-8"/>
                                    </div>
                                    <div className="search-input">
                                        <select className="form-control form-select h6 rounded-4 mb-0 py-6 px-8">
                                            <option value="" selected disabled>plan</option>
                                            <option value="">Basic Plan</option>
                                            <option value="">Standard Plan</option>
                                            <option value="">Premium Plan </option>
                                        </select>
                                    </div>
                                    <div className="search-input">
                                        <button type="submit" className="btn btn-main rounded-pill py-9 w-100">Apply Filter</button>
                                    </div>
                                </form>                    
                            </div>
                        </div>

                        <div className="card-body p-0 overflow-x-auto">
                            <table id="studentTable" className="table table-lg table-striped w-100">
                                <thead>
                                    <tr>
                                        <th className="fixed-width w-40 h-40 ps-20">
                                            <div className="form-check">
                                                <input className="form-check-input border-gray-200 rounded-4" type="checkbox" id="selectAll"/>
                                            </div>
                                        </th>
                                        <th className="h6 text-gray-600">
                                            <span className="position-relative">
                                                Invoices
                                            </span>
                                        </th>
                                        <th className="h6 text-gray-600 text-center">Amount</th>
                                        <th className="h6 text-gray-600 text-center">Dates</th>
                                        <th className="h6 text-gray-600 text-center">Status</th>
                                        <th className="h6 text-gray-600 text-center">Plan</th>
                                        <th className="h6 text-gray-600 text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="fixed-width w-40 h-40">
                                            <div className="form-check">
                                                <input className="form-check-input border-gray-200 rounded-4" type="checkbox"/>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="flex-align gap-10">
                                                <div className="w-32 h-32 bg-gray-50 flex-center rounded-circle p-2"> 
                                                    <img src="assets/images/thumbs/invoice-logo1.png" alt="" className=""/>
                                                </div>
                                                <div className="">
                                                    <h6 className="mb-0">Design Accesibility</h6>
                                                    <span className="text-13 fw-medium text-gray-200">Edmate - #012500</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="text-center">
                                            <span className="text-gray-600">$180</span>
                                        </td>
                                        <td className="text-center">
                                            <span className="text-gray-600">06/22/2024</span>
                                        </td>
                                        <td className="text-center">
                                            <span className="text-success-600 bg-success-100 py-2 px-10 rounded-pill">Paid</span>
                                        </td>
                                        <td className="text-center">
                                            <span className="text-gray-600">Basic</span>
                                        </td>
                                        <td className="text-center">
                                            <button type="button" className="btn btn-outline-main bg-main-100 border-main-100 text-main-600 rounded-pill py-12">Download</button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="fixed-width w-40 h-40">
                                            <div className="form-check">
                                                <input className="form-check-input border-gray-200 rounded-4" type="checkbox"/>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="flex-align gap-10">
                                                <div className="w-32 h-32 bg-gray-50 flex-center rounded-circle p-2"> 
                                                    <img src="assets/images/thumbs/invoice-logo2.png" alt="" className="" />
                                                </div>
                                                <div className="">
                                                    <h6 className="mb-0">Design System</h6>
                                                    <span className="text-13 fw-medium text-gray-200">Edmate - #012500</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="text-center">
                                            <span className="text-gray-600">$250</span>
                                        </td>
                                        <td className="text-center">
                                            <span className="text-gray-600">06/22/2024</span>
                                        </td>
                                        <td className="text-center">
                                            <span className="text-info-600 bg-info-100 py-2 px-10 rounded-pill">Unpaid</span>
                                        </td>
                                        <td className="text-center">
                                            <span className="text-gray-600">Professional</span>
                                        </td>
                                        <td className="text-center">
                                            <button type="button" className="btn btn-outline-main bg-main-100 border-main-100 text-main-600 rounded-pill py-12">Download</button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="fixed-width w-40 h-40">
                                            <div className="form-check">
                                                <input className="form-check-input border-gray-200 rounded-4" type="checkbox"/>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="flex-align gap-10">
                                                <div className="w-32 h-32 bg-gray-50 flex-center rounded-circle p-2"> 
                                                    <img src="assets/images/thumbs/invoice-logo1.png" alt="" className=""/>
                                                </div>
                                                <div className="">
                                                    <h6 className="mb-0">Frondend Develop</h6>
                                                    <span className="text-13 fw-medium text-gray-200">Edmate - #012500</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="text-center">
                                            <span className="text-gray-600">$128</span>
                                        </td>
                                        <td className="text-center">
                                            <span className="text-gray-600">06/22/2024</span>
                                        </td>
                                        <td className="text-center">
                                            <span className="text-success-600 bg-success-100 py-2 px-10 rounded-pill">Paid</span>
                                        </td>
                                        <td className="text-center">
                                            <span className="text-gray-600">Basic</span>
                                        </td>
                                        <td className="text-center">
                                            <button type="button" className="btn btn-outline-main bg-main-100 border-main-100 text-main-600 rounded-pill py-12">Download</button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="fixed-width w-40 h-40">
                                            <div className="form-check">
                                                <input className="form-check-input border-gray-200 rounded-4" type="checkbox"/>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="flex-align gap-10">
                                                <div className="w-32 h-32 bg-gray-50 flex-center rounded-circle p-2"> 
                                                    <img src="assets/images/thumbs/invoice-logo1.png" alt="" className=""/>
                                                </div>
                                                <div className="">
                                                    <h6 className="mb-0">Design Usability</h6>
                                                    <span className="text-13 fw-medium text-gray-200">Edmate - #012500</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="text-center">
                                            <span className="text-gray-600">$132</span>
                                        </td>
                                        <td className="text-center">
                                            <span className="text-gray-600">06/22/2024</span>
                                        </td>
                                        <td className="text-center">
                                            <span className="text-info-600 bg-info-100 py-2 px-10 rounded-pill">Unpaid</span>
                                        </td>
                                        <td className="text-center">
                                            <span className="text-gray-600">Basic</span>
                                        </td>
                                        <td className="text-center">
                                            <button type="button" className="btn btn-outline-main bg-main-100 border-main-100 text-main-600 rounded-pill py-12">Download</button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="fixed-width w-40 h-40">
                                            <div className="form-check">
                                                <input className="form-check-input border-gray-200 rounded-4" type="checkbox"/>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="flex-align gap-10">
                                                <div className="w-32 h-32 bg-gray-50 flex-center rounded-circle p-2"> 
                                                    <img src="assets/images/thumbs/invoice-logo4.png" alt="" className=""/>
                                                </div>
                                                <div className="">
                                                    <h6 className="mb-0">Digital Marketing</h6>
                                                    <span className="text-13 fw-medium text-gray-200">Edmate - #012500</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="text-center">
                                            <span className="text-gray-600">$186</span>
                                        </td>
                                        <td className="text-center">
                                            <span className="text-gray-600">06/22/2024</span>
                                        </td>
                                        <td className="text-center">
                                            <span className="text-success-600 bg-success-100 py-2 px-10 rounded-pill">Paid</span>
                                        </td>
                                        <td className="text-center">
                                            <span className="text-gray-600">Advance</span>
                                        </td>
                                        <td className="text-center">
                                            <button type="button" className="btn btn-outline-main bg-main-100 border-main-100 text-main-600 rounded-pill py-12">Download</button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="card-footer border-top border-gray-100">
                            <div className="flex-align justify-content-end gap-8">
                                <button type="reset" className="btn btn-outline-main bg-main-100 border-main-100 text-main-600 rounded-pill py-9">Cancel</button>
                                <button type="submit" className="btn btn-main rounded-pill py-9">Save  Changes</button>
                            </div>
                        </div>
                    </div>
     );
}
 
export default BillingHistory;