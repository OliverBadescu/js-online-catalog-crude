export async function getAllStudents(){


    try{


        let response= await apiUser(`getAllUsers`);

        let data= await response.json();
        return data;

    }catch(err){
        return { success: false, message: "An error occurred while getting the users." };

    }

}

export async function getUserById(userId) {
    try{

       
        let response= await apiUser(`getUserById/${userId}`);
        if (response.ok) {
            return await response.json(); 
        } else {
            return { success: false, message: "Failed to fetch user data." };
        }

    }catch(err){
        return { success: false, message: "An error occurred while getting the user data." };

    }

    
}

export async function getUsersGrades(userId) {
    try{

       
        let response= await apiGrade(`getAllUserGrades/${userId}`);
        if (response.ok) {
            return await response.json(); 
        } else {
            return { success: false, message: "Failed to fetch user grades." };
        }

    }catch(err){
        return { success: false, message: "An error occurred while getting the user grades." };

    }

    
}

export async function createGrade(grade,userId){

    try{


        let response= await apiGrade(`add/${userId}`,"POST",grade);


        if (response.ok) {
           let data = await response.json();
           return { success: true, data }; 
       } else {
           let error = await response.json();
           return { success: false, message: error.message }; 
       }

   }catch(err){

       return { success: false, message: "An error occurred while creating the grade." };
   }

}


export async function createUser(user){

    try{


        let response= await apiUser("add","POST",user);


        if (response.ok) {
           let data = await response.json();
           return { success: true, data }; 
       } else {
           let error = await response.json();
           return { success: false, message: error.message }; 
       }

   }catch(err){

       return { success: false, message: "An error occurred while creating the user." };
   }
}



function apiUser(path, method = "GET", body = null) {
    const url = "http://localhost:8080/user/" + path;
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'X-Requested-With': 'XMLHttpRequest',
        }
    }
    if (body != null) {
        options.body = JSON.stringify(body);
    }
    
    return fetch(url, options);
}

function apiGrade(path, method = "GET", body = null) {
    const url = "http://localhost:8080/grade/" + path;
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'X-Requested-With': 'XMLHttpRequest',
        }
    }
    if (body != null) {
        options.body = JSON.stringify(body);
    }
    
    return fetch(url, options);
}