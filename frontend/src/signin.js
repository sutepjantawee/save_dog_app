import React from 'react';
import { Link } from "react-router-dom";

export default function signin() {
    return (
        <div>
            <form>
                <label>
                    Name:
                    <input type="text" name="name" />
                </label>
                <nav>
                    <Link to="/user">Login</Link>
                </nav>
            </form>


        </div>
    )
}
