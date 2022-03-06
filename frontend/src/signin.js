import React from 'react';
import {
    Link,
    Outlet,
  } from "react-router-dom";


export default function signin() {



    return (
        <div>
            <form>
                <label>
                   
                    <input type="text" name="name" />
                </label>

                

                <nav>
                    <Link to="/user">Login</Link>
                </nav>
            </form>
            <div>
        <Outlet />
      </div>

        </div>
    )
}
