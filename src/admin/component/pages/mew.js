  // useEffect(() => {
    //     // Fetch data from localStorage
        const adminDataString = localStorage.getItem('adminData');
        if (adminDataString) {
            const adminData = JSON.parse(adminDataString);
            // Set the username in the formData state
            setFormData((prevData) => ({
                ...prevData,
                username: adminData.username || '',
            }));

            // Fetch additional data from Firebase based on the username
            const username = adminData.username; // Replace with the actual username
            fetchUserData(username);
        } else {
            console.error('Admin data not found in localStorage');
        }
    // }, []);

    const fetchUserData = async (username) => {
        try {
            // Retrieve data from Firebase based on username
            const userRef = ref(db, 'Admin');
            const userquery = query(userRef, orderByChild('username'), equalTo(username));

            onValue(userquery, (snapshot) => {
                if (snapshot.exists()) {
                    const userData = snapshot.val();
                    let key = Object.keys(userData);

                    console.log(`${key}`);
                    updateProfile(key);

                } else {
                    console.error('User data not found in Firebase');
                }
            });
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    // const updateProfile = async (userKey) => {
    //     try {
    //         const { email, phone } = formData;
    
    //         // Update the user profile in Firebase using update
    //         await update(ref(db, `Admin/${userKey}`), {
    //             email,
    //             phone,
    //         });
    
    //         console.log('Firebase update successful');
    
    //     } catch (error) {
    //         console.error('Error updating user profile:', error);
    //     }
    // };
    