const PaymentMethods = () => {
    return ( 
        <div className="card mt-24">
            <div className="card-header border-bottom">
                <h4 className="mb-4">Payment Method</h4>
                <p className="text-gray-600 text-15">Update your billing details and address</p>
            </div>
            <div className="card-body">
                <div className="row gy-4">
                    <div className="col-lg-5">
                        <div className="card border border-gray-100">
                            <div className="card-header border-bottom border-gray-100">
                                <h6 className="mb-0">Contact Email</h6>
                            </div>
                            <div className="card-body">
                                <div className="payment-method payment-method-one form-check form-radio d-flex align-items-center justify-content-between mb-16 rounded-16 bg-main-50 p-20 cursor-pointer position-relative transition-2">
                                    <div>
                                        <h6 className="title mb-14">Send to my email account</h6>
                                        <span className="d-block">exampleinfo@mail.com</span>
                                    </div>
                                    <label className="position-absolute inset-block-start-0 inset-inline-start-0 w-100 h-100 cursor-pointer" htmlFor="emailOne"></label>
                                    <input className="form-check-input payment-method-one" type="radio" name="emailCheck" id="emailOne"/>
                                </div>
                                <div className="payment-method payment-method-one form-check form-radio d-block rounded-16 bg-main-50 p-20 cursor-pointer position-relative transition-2 mt-24">
                                    <div className="flex-between  mb-14 gap-4">
                                        <h6 className="title mb-0">Send to an alternative email</h6>
                                        <input className="form-check-input payment-method-one" type="radio" name="emailCheck" id="emailTwo"/>
                                    </div>
                                    <label className="position-absolute inset-block-start-0 inset-inline-start-0 w-100 h-100 cursor-pointer" htmlFor="emailTwo"></label>
                                    <span className="border-text d-block bg-white border border-main-200 px-20 py-8 rounded-8">exampleinfo@mail.com</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-7">
                        <div className="card border border-gray-100">
                            <div className="card-header border-bottom border-gray-100 flex-between gap-8">
                                <h6 className="mb-0">Card Details</h6>
                                <a href="#" className="btn btn-outline-main rounded-pill py-6">Add New Card</a>
                            </div>
                            <div className="card-body">
                                <div className="payment-method payment-method-two form-check form-radio d-flex align-items-center justify-content-between mb-16 rounded-16 bg-main-50 p-20 cursor-pointer position-relative transition-2">
                                    <div className="flex-align align-items-start gap-16">
                                        <div>
                                            <img src="assets/images/thumbs/payment-method1.png" alt="" className="w-54 h-40 rounded-8"/>
                                        </div>
                                        <div>
                                            <h6 className="title mb-0">Visa **** **** 5890</h6>
                                            <span className="d-block">Up to 60 User and 100GB team data</span>
                                            <div className="text-13 flex-align gap-8 mt-12 pt-12 border-top border-gray-100">
                                                <span>Set as default</span>
                                                <a href="#" className="fw-bold">Edit</a>
                                            </div>
                                        </div>
                                    </div>
                                    <label className="position-absolute inset-block-start-0 inset-inline-start-0 w-100 h-100 cursor-pointer" htmlFor="visaCard"></label>
                                    <input className="form-check-input payment-method-two" type="radio" name="cardDetails" id="visaCard"/>
                                </div>
                                <div className="payment-method payment-method-two form-check form-radio d-flex align-items-center justify-content-between rounded-16 bg-main-50 p-20 cursor-pointer position-relative transition-2">
                                    <div className="flex-align align-items-start gap-16">
                                        <div>
                                            <img src="assets/images/thumbs/payment-method2.png" alt="" className="w-54 h-40 rounded-8"/>
                                        </div>
                                        <div>
                                            <h6 className="title mb-0">Mastercard **** **** 1895</h6>
                                            <span className="d-block">Up to 60 User and 100GB team data</span>
                                        </div>
                                    </div>
                                    <label className="position-absolute inset-block-start-0 inset-inline-start-0 w-100 h-100 cursor-pointer" htmlFor="masterCard"></label>
                                    <input className="form-check-input payment-method-two" type="radio" name="cardDetails" id="masterCard"/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
     );
}
 
export default PaymentMethods;