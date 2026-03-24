import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private StorageKey = "registeredUsers";

  // 1. Register User (Duplicate Email check ke saath)
  registeruser(userdata: any): boolean { 
    const users = this.getregisteredUser();

    // Check karo ki ye email pehle se toh nahi hai?
    const isExist = users.find((u: any) => u.email === userdata.email);
    
    if (isExist) {
      return false; // User already exists
    }

    users.push(userdata);
    localStorage.setItem(this.StorageKey, JSON.stringify(users));
    return true; // Registration Success
  }

  // 2. Get Users from LocalStorage
  getregisteredUser() {
    const data = localStorage.getItem(this.StorageKey);
    // Hamesha check karein ki data string hai ya nahi
    return data ? JSON.parse(data) : [];
  }
}