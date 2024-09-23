const Password = () => {
    return ( 
        <div className="card mt-24">
                        <div className="card-header border-bottom">
                            <h4 className="mb-4">Configurations Mot de Passe</h4>
                            <p className="text-gray-600 text-15">Please fill full details about yourself</p>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-6">
                                    <form action="#">
                                        <div className="row gy-4">
                                            <div className="col-12">
                                                <label htmlFor="current-password" className="form-label mb-8 h6">Current Password</label>
                                                <div className="position-relative">
                                                    <input type="password" className="form-control py-11" id="current-password" placeholder="Enter Current Password"/>
                                                    <span className="toggle-password position-absolute top-50 inset-inline-end-0 me-16 translate-middle-y ph ph-eye-slash" id="#current-password"></span>
                                                </div>
                                            </div>
                                            <div className="col-12">
                                                <label htmlFor="new-password" className="form-label mb-8 h6">New Password</label>
                                                <div className="position-relative">
                                                    <input type="password" className="form-control py-11" id="new-password" placeholder="Enter New Password"/>
                                                    <span className="toggle-password position-absolute top-50 inset-inline-end-0 me-16 translate-middle-y ph ph-eye-slash" id="#new-password"></span>
                                                </div>
                                            </div>
                                            <div className="col-12">
                                                <label htmlFor="confirm-password" className="form-label mb-8 h6">Confirm Password</label>
                                                <div className="position-relative">
                                                    <input type="password" className="form-control py-11" id="confirm-password" placeholder="Enter Confirm Password"/>
                                                    <span className="toggle-password position-absolute top-50 inset-inline-end-0 me-16 translate-middle-y ph ph-eye-slash" id="#confirm-password"></span>
                                                </div>
                                            </div>
                                            <div className="col-12">
                                                <label className="form-label mb-8 h6">Password Requirements:</label>
                                                <ul className="list-inside">
                                                    <li className="text-gray-600 mb-4">At least one lowercase character</li>
                                                    <li className="text-gray-600 mb-4">Minimum 8 characters long - the more, the better</li>
                                                    <li className="text-gray-300 mb-4">At least one number, symbol, or whitespace character</li>
                                                </ul>
                                            </div>
                                            {/* <div className="col-12">
                                                <label className="form-label mb-8 h6">Two-Step Verification</label>
                                                <ul>
                                                    <li className="text-gray-600 mb-4 fw-semibold">Two-factor authentication is not enabled yet.</li>
                                                    <li className="text-gray-600 mb-4 fw-medium">Two-factor authentication adds a layer of security to your account by requiring more than just a password to log in. Learn more.</li>
                                                </ul>
                                                <button type="submit" className="btn btn-main rounded-pill py-9 mt-24">Enable two-factor authentication</button>
                                            </div> */}
                                        </div>
                                    </form>
                                </div>
                                <div className="col-12">
                                    <div className="flex-align justify-content-end gap-8">
                                        <button type="reset" className="btn btn-outline-main bg-main-100 border-main-100 text-main-600 rounded-pill py-9">Cancel</button>
                                        <button type="submit" className="btn btn-main rounded-pill py-9">Enregistrer</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
     );
}
 
export default Password;