const AboutMe = () => {
    return ( 
        <div className="row gy-4">
                        <div className="col-lg-6">
                            <div className="card mt-24">
                                <div className="card-body">
                                    <h6 className="mb-12">A Propos de moi</h6>
                                    <p className="text-gray-600 text-15 rounded-8 border border-gray-100 p-16">Petite description de ma personne ...</p>
                                </div>
                            </div>
                            <div className="card mt-24">
                                <div className="card-body">
                                    <h6 className="mb-12">Messages Récents</h6>
                                    
                                    <div className="rounded-8 border border-gray-100 p-16 mb-16">
                                        <div className="comments-box__content flex-between gap-8">
                                            <div className="flex-align align-items-start gap-12">
                                                <img src="assets/images/thumbs/user-img1.png" className="w-32 h-32 rounded-circle object-fit-cover flex-shrink-0" alt="User Image" />
                                                <div>
                                                    <h6 className="text-lg mb-8">Michel Smith</h6>
                                                    <p className="text-gray-600 text-15">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Commodo pellentesque massa </p>
                                                </div>
                                            </div>
                                            <button type="button" className="flex-shrink-0 fw-bold text-13 text-main-600 flex-align gap-8 hover-text-main-800">Reply <i className="ph ph-arrow-bend-up-left d-flex text-lg"></i> </button>
                                        </div>
                                    </div>

                                    <div className="rounded-8 border border-gray-100 p-16 mb-16">
                                        <div className="comments-box__content flex-between gap-8">
                                            <div className="flex-align align-items-start gap-12">
                                                <img src="assets/images/thumbs/user-img5.png" className="w-32 h-32 rounded-circle object-fit-cover flex-shrink-0" alt="User Image"/>
                                                <div>
                                                    <h6 className="text-lg mb-8">Zara Maliha</h6>
                                                    <p className="text-gray-600 text-15">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Commodo pellentesque massa </p>
                                                </div>
                                            </div>
                                            <button type="button" className="flex-shrink-0 fw-bold text-13 text-main-600 flex-align gap-8 hover-text-main-800">Reply <i className="ph ph-arrow-bend-up-left d-flex text-lg"></i> </button>
                                        </div>
                                    </div>

                                    <div className="rounded-8 border border-gray-100 p-16 mb-16">
                                        <div className="comments-box__content flex-between gap-8">
                                            <div className="flex-align align-items-start gap-12">
                                                <img src="assets/images/thumbs/user-img3.png" className="w-32 h-32 rounded-circle object-fit-cover flex-shrink-0" alt="User Image"/>
                                                <div>
                                                    <h6 className="text-lg mb-8">Simon Doe</h6>
                                                    <p className="text-gray-600 text-15">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Commodo pellentesque massa </p>
                                                </div>
                                            </div>
                                            <button type="button" className="flex-shrink-0 fw-bold text-13 text-main-600 flex-align gap-8 hover-text-main-800">Reply <i className="ph ph-arrow-bend-up-left d-flex text-lg"></i> </button>
                                        </div>
                                    </div>

                                    <div className="rounded-8 border border-gray-100 p-16 mb-16">
                                        <div className="comments-box__content flex-between gap-8">
                                            <div className="flex-align align-items-start gap-12">
                                                <img src="assets/images/thumbs/user-img4.png" className="w-32 h-32 rounded-circle object-fit-cover flex-shrink-0" alt="User Image"/>
                                                <div>
                                                    <h6 className="text-lg mb-8">Elejabeth Jenny</h6>
                                                    <p className="text-gray-600 text-15">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Commodo pellentesque massa </p>
                                                </div>
                                            </div>
                                            <button type="button" className="flex-shrink-0 fw-bold text-13 text-main-600 flex-align gap-8 hover-text-main-800">Reply <i className="ph ph-arrow-bend-up-left d-flex text-lg"></i> </button>
                                        </div>
                                    </div>

                                    <div className="rounded-8 border border-gray-100 p-16 mb-16">
                                        <div className="flex-between gap-8">
                                            <div className="flex-align align-items-start gap-12">
                                                <img src="assets/images/thumbs/user-img8.png" className="w-32 h-32 rounded-circle object-fit-cover flex-shrink-0" alt="User Image"/>
                                                <div>
                                                    <h6 className="text-lg mb-8">Ronald Doe</h6>
                                                    <p className="text-gray-600 text-15">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Commodo pellentesque massa </p>
                                                </div>
                                            </div>
                                            <button type="button" className="flex-shrink-0 fw-bold text-13 text-main-600 flex-align gap-8 hover-text-main-800">Reply <i className="ph ph-arrow-bend-up-left d-flex text-lg"></i> </button>
                                        </div>
                                    </div>

                                    <a href="#" className="flex-shrink-0 fw-bold text-13 text-main-600 flex-align gap-8 hover-text-main-800 hover-text-decoration-underline">
                                        View All <i className="ph ph-arrow-right"></i>
                                    </a>
                                </div>
                            </div>
                            <div className="card mt-24">
                                <div className="card-body">
                                    <h6 className="mb-12">Social Media</h6>
                                    <ul className="flex-align flex-wrap gap-8">
                                        <li>
                                            <a href="https://www.facebook.com" className="flex-center w-36 h-36 border border-main-600 text-main-600 rounded-circle text-xl hover-bg-main-100 hover-border-main-800"><i className="ph ph-facebook-logo"></i></a> 
                                        </li>
                                        <li>
                                            <a href="https://www.google.com" className="flex-center w-36 h-36 border border-main-600 text-main-600 rounded-circle text-xl hover-bg-main-100 hover-border-main-800"> <i className="ph ph-twitter-logo"></i></a>
                                        </li>
                                        <li>
                                            <a href="https://www.twitter.com" className="flex-center w-36 h-36 border border-main-600 text-main-600 rounded-circle text-xl hover-bg-main-100 hover-border-main-800"><i className="ph ph-linkedin-logo"></i></a>
                                        </li>
                                        <li>
                                            <a href="https://www.instagram.com" className="flex-center w-36 h-36 border border-main-600 text-main-600 rounded-circle text-xl hover-bg-main-100 hover-border-main-800"><i className="ph ph-instagram-logo"></i></a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="card mt-24">
                                <div className="card-body">
                                    <div className="row gy-4">
                                        <div className="col-xxl-4 col-xl-6 col-md-4 col-sm-6">
                                            <div className="statistics-card p-xl-4 p-16 flex-align gap-10 rounded-8 bg-main-50">
                                                <span className="text-white bg-main-600 w-36 h-36 rounded-circle flex-center text-xl flex-shrink-0"><i className="ph ph-users-three"></i></span>
                                                <div>
                                                    <h4 className="mb-0">450k</h4>
                                                    <span className="fw-medium text-main-600">Followers</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-xxl-4 col-xl-6 col-md-4 col-sm-6">
                                            <div className="statistics-card p-xl-4 p-16 flex-align gap-10 rounded-8 bg-info-50">
                                                <span className="text-white bg-info-600 w-36 h-36 rounded-circle flex-center text-xl flex-shrink-0"><i className="ph ph-users-three"></i></span>
                                                <div>
                                                    <h4 className="mb-0">289k</h4>
                                                    <span className="fw-medium text-info-600">Following</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-xxl-4 col-xl-6 col-md-4 col-sm-6">
                                            <div className="statistics-card p-xl-4 p-16 flex-align gap-10 rounded-8 bg-purple-50">
                                                <span className="text-white bg-purple-600 w-36 h-36 rounded-circle flex-center text-xl flex-shrink-0"><i className="ph ph-thumbs-up"></i></span>
                                                <div>
                                                    <h4 className="mb-0">1256k</h4>
                                                    <span className="fw-medium text-purple-600">Likes</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-24">
                                        <div className="flex-align gap-8 flex-wrap mb-16">
                                            <span className="flex-center w-36 h-36 text-main-600 bg-main-100 rounded-circle text-xl"> 
                                                <i className="ph ph-phone"></i>
                                            </span>
                                            <div className="flex-align gap-8 flex-wrap text-gray-600">
                                                <span>+00 123 456 789</span>
                                                <span>+00 123 456 789</span>
                                            </div>
                                        </div>
                                        <div className="flex-align gap-8 flex-wrap mb-16">
                                            <span className="flex-center w-36 h-36 text-main-600 bg-main-100 rounded-circle text-xl"> 
                                                <i className="ph ph-envelope-simple"></i>
                                            </span>
                                            <div className="flex-align gap-8 flex-wrap text-gray-600">
                                                <span>exampleinfo1@mail.com,</span>
                                                <span>exampleinfo2@mail.com</span>
                                            </div>
                                        </div>
                                        <div className="flex-align gap-8 flex-wrap mb-16">
                                            <span className="flex-center w-36 h-36 text-main-600 bg-main-100 rounded-circle text-xl"> 
                                                <i className="ph ph-map-pin"></i>
                                            </span>
                                            <div className="flex-align gap-8 flex-wrap text-gray-600">
                                                <span>Inner Circular Road, New York City, 0123</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card mt-24">
                                <div className="card-body">
                                    <h6 className="mb-12">A mon Propos</h6>
                                    <div className="recent-post rounded-8 border border-gray-100 p-16 d-flex gap-12 mb-16">
                                        <div className="d-inline-flex w-100 max-w-130 flex-shrink-0">
                                            <img src="assets/images/thumbs/recent-post-img1.png" alt="" className="rounded-6 cover-img max-w-130"/>
                                        </div>
                                        <div>
                                            <p className="text-gray-600 text-line-3">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Commodo pellentesque massa tellus ac augue. Lectus arcu at in in rhoncus malesuada ipsum turpis.</p>
                                            <div className="flex-align gap-8 mt-24">
                                                <img src="assets/images/thumbs/user-img1.png" alt="" className="w-32 h-32 rounded-circle cover-img"/>
                                                <span className="text-gray-600 text-13">Michel Bruice</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="recent-post rounded-8 border border-gray-100 p-16 d-flex gap-12 mb-16">
                                        <div className="d-inline-flex w-100 max-w-130 flex-shrink-0">
                                            <img src="assets/images/thumbs/recent-post-img2.png" alt="" className="rounded-6 cover-img max-w-130"/>
                                        </div>
                                        <div>
                                            <p className="text-gray-600 text-line-3">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Commodo pellentesque massa tellus ac augue. Lectus arcu at in in rhoncus malesuada ipsum turpis.</p>
                                            <div className="flex-align gap-8 mt-24">
                                                <img src="assets/images/thumbs/user-img2.png" alt="" className="w-32 h-32 rounded-circle cover-img"/>
                                                <span className="text-gray-600 text-13">Sara Smith</span>
                                            </div>
                                        </div>
                                    </div>

                                    <h6 className="mb-12 mt-24">Ajouter un post</h6>
                                    <div className="editor style-two">
                                        <div id="editorTwo">
                                            <p>A quoi pensez-vous ...</p>
                                        </div>
                                    </div>

                                    <div className="flex-between flex-wrap gap-8 mt-24">
                                        <div className="flex-align flex-wrap gap-8">
                                            <button type="button" className="flex-center w-26 h-26 text-gray-600 bg-gray-50 hover-bg-gray-100 rounded-circle text-md"> 
                                                <i className="ph ph-smiley"></i>
                                            </button>
                                            <button type="button" className="flex-center w-26 h-26 text-gray-600 bg-gray-50 hover-bg-gray-100 rounded-circle text-md"> 
                                                <i className="ph ph-camera"></i>
                                            </button>
                                            <button type="button" className="flex-center w-26 h-26 text-gray-600 bg-gray-50 hover-bg-gray-100 rounded-circle text-md"> 
                                                <i className="ph ph-image"></i>
                                            </button>
                                            <button type="button" className="flex-center w-26 h-26 text-gray-600 bg-gray-50 hover-bg-gray-100 rounded-circle text-md"> 
                                                <i className="ph ph-video-camera"></i>
                                            </button>
                                            <button type="button" className="flex-center w-26 h-26 text-gray-600 bg-gray-50 hover-bg-gray-100 rounded-circle text-md"> 
                                                <i className="ph ph-google-drive-logo"></i>
                                            </button>
                                        </div>
                                        <button type="submit" className="btn btn-main rounded-pill py-9"> Poster </button>
                                    </div>
                                    
                                </div>
                            </div>
                        </div>
                    </div>
     );
}
 
export default AboutMe;