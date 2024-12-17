export async function getAllStudents(){


    try{


        let response= await apiUser(`getAllUsers`);
        let data= await response.json();

        return {
             status: response.status,
             body: data

        };

       

    }catch(err){
        return { success: false, message: err };

    }

}

export async function getUserById(userId) {
    try{

       
        let response= await apiUser(`getUserById/${userId}`);
        let data= await response.json();

        return {
            status: response.status,
            body: data

       };

    }catch(err){
        return { success: false, message: err };

    }

    
}

export async function getUsersGrades(userId) {
    try{

       
        let response= await apiGrade(`getAllUserGrades/${userId}`);
        let data= await response.json();

        return {
            status: response.status,
            body: data

       };

    }catch(err){

        return { success: false, message: err };

    }

    
}

export async function createGrade(grade,userId){

    try{


        let response= await apiGrade(`add/${userId}`,"POST",grade);
        let data= await response.json();

        return {
            status: response.status,
            body: data

       };

   }catch(err){

       return { success: false, message: err };
   }

}


export async function createUser(user){

    try{


        let response= await apiUser("add","POST",user);

        let data= await response.json();

        return {
            status: response.status,
            body: data

       };

   }catch(err){

       return { success: false, message: err };
   }
}

export async function updateUser(userId,user){

    try{


        let response= await apiUser(`update/${userId}`,"PUT",user);

        let data= await response.json();

        return {
            status: response.status,
            body: data

       };

   }catch(err){

       return { success: false, message: err };
   }
}


export async function deleteUser(userId){

    try{


        let response= await apiUser(`delete/${userId}`,"DELETE");
        let data= await response.json();

        return {
            status: response.status,
            body: data

       };

   }catch(err){

       return { success: false, message: err };
   }
}


export async function getGradeById(gradeId){
    try{

       
        let response= await apiGrade(`getGradeById/${gradeId}`);
        let data= await response.json();

        return {
            status: response.status,
            body: data

       };
    }catch(err){
        return { success: false, message: err };

    }
}

export async function updateGrade(gradeId,gradeResponse){

    try{

       
        let response= await apiGrade(`update/${gradeId}`, "PUT", gradeResponse);
        let data= await response.json();

        return {
            status: response.status,
            body: data

       };

    }catch(err){
        return { success: false, message: err };

    }

}

export async function deleteGrade(gradeId){

    try{

       
        let response= await apiGrade(`delete/${gradeId}`, "DELETE");
        let data= await response.json();

        return {
            status: response.status,
            body: data

       };

    }catch(err){
        return { success: false, message: err };

    }

}

export async function login(loginRequest){
    try{


        let response= await apiUser(`login`,"POST",loginRequest)


        let data= await response.json();


        return {
            status: response.status,
            body: data

       };

   }catch(err){

       return { success: false, message: err };
   }
}

export async function register(userRequest){
    try{


        let response= await apiUser(`register`,"POST",userRequest);
        let data= await response.json();


        return {
            status: response.status,
            body: data

       };

   }catch(err){

       return { success: false, message: err };
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