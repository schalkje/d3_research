import * as React from 'react';
import '../../layout/App.css';
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
    Breadcrumbs as MUIBreadcrumbs,
    Typography
} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeIcon from '@mui/icons-material/Home';

export default function Breadcrumb2() {
    const location = useLocation();
    const navigate = useNavigate();

    const pathnames = location.pathname.split("/").filter(x => x);

    return (
        <MUIBreadcrumbs
            separator={<NavigateNextIcon fontSize="small" sx={{ color: "lightgrey", margin: '0px -4px 0px -4px' }} />}
            aria-label="breadcrumb">

            {pathnames.length > 0 ? (
                <Link to="/" className='breadcrumbLink' >
                    <HomeIcon sx={{ mr: 0.5, color: '#AAA', margin: '0px 4px 0px 8px' }} fontSize="inherit" />
                    Overview
                </Link>
            ) : (
                <Link to="/" className='breadcrumbLast' >
                    <HomeIcon sx={{ mr: 0.5, color: '#AAA', margin: '0px 4px 0px 8px' }} fontSize="inherit" />
                    Overview
                </Link>
            )}

            {pathnames.map((name, index) => {
                const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
                const isLast = index === pathnames.length - 1;
                return isLast ? (
                    <Link key={name} to={routeTo} className='breadcrumbLast'>
                        {name}
                    </Link>
                ) : (
                    <Link key={name} to={routeTo} className='breadcrumbLink'>
                        {name}
                    </Link>
                );
            })}
        </MUIBreadcrumbs>
    );
}
