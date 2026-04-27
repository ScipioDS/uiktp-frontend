import { Component } from '@angular/core';
import { Header } from '../header/header';
import { RouterLink } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-landing-page',
  imports: [RouterLink, NgOptimizedImage],
  templateUrl: './landing-page.html',
  styleUrl: './landing-page.css',
})
export class LandingPage {}
