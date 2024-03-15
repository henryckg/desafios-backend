class UserDTO {
    constructor(user){
        this.first_name = user.first_name,
        this.last_name = user.last_name,
        this.age = user.age ? user.age : '',
        this.email = user.email,
        this.cart = user.cart
        this.role = user.role ? user.role : 'user'
    }

    getCurrentUser(){
        return {
            fullName: this.first_name + this.last_name,
            email: this.email,
            role: this.role
        }
    }
}

export default UserDTO