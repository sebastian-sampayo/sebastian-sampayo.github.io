---
title: Sampayo, Sebastian Lucas
---

[//]: # (Image References)
[behavioral]: ./imgs/behavioral.png
[vehicleDet]: ./imgs/vehicleDet.png
[thesis]: ./imgs/thesis.png
[amusement]: ./imgs/amusement.png
[kepler]: ./imgs/keplerOrbit.png


# Welcome to my personal website

This a personal website designed to host some featured projects of my career.
I am an Electronic Engineer graduated from the University of Buenos Aires.
In this web you can take a look at my projects, download my Curriculum Vitae and also my Thesis report.

# Self-Driving Car Engineering Projects

These projects were done through the Self-Driving Car Engineer Nanodegree course.

## Behavioral Cloning

![Simulator][behavioral]

Here I built and trained a convolutional neural network for end-to-end driving in a simulator, using TensorFlow and Keras. I used optimization techniques such as regularization and dropout to generalize the network for driving on multiple tracks. This methods turned out successfully, since I managed to keep the car stay on the road in a completely new scenario all along the track. There is a [YouTube video](https://youtu.be/xRBW0KxH8AY) where you can watch how it drove in that case.

[Link to source](https://github.com/sebastian-sampayo/Behavioral-Cloning-Project-Udacity)


## Vehicle Detection and Tracking

![Heatmap][vehicleDet]

In this project I created a vehicle detection and tracking pipeline with OpenCV, histogram of oriented gradients (HOG), and support vector machines (SVM). I also optimized and evaluated the model on video data from a automotive camera taken during highway driving. You can watch it [here](https://youtu.be/zxqPGv7t-no).

[Link to source](https://github.com/sebastian-sampayo/Vehicle-Detection-Udacity)


# Thesis

![Thesis][thesis]

**Title**: "Guidance, Navigation and Control System for injection of small satellite into LEO (low-Earth orbit)" 
**Advisor**: Dr. Eng. Juan I. Giribet

The thesis was the last step on my way towards the Electronic Engineer degree. I dedicated full time over 10 months in 2016, after passing the last course of the curricula. I wanted to research on a subject where I could be able to apply all the knowledge I had obtained during the previous years, and also to contribute to the solution of a real-world problem.
That's how I got in touch with Juan and decided to work in guidance, navigation and control algorithms for autonomous aerospace vehicles, specifically for autonomous orbit injection of small spacecrafts. This topic was awesome because it connected a lot of different subjects: 
- to understand the dynamics of such vehicle you need to study a lot of **physics**,
- when you want to describe and predict the behavior of it, you have to create a **math** model,
- if you want to actually control the motion of the spacecraft, you can apply all about **control theory**,
- modern technology lets us implement all the algorithms in **software** programs that we can embed in the vehicle computer,
- for our model to interact with the real world we must use actuators and sensors and some kind of **hardware** to interface them with the computer,

so there was a lot of acquired knowledge to apply and much more to keep learning.

As Juan was the director of a research group at college (GPSIC), I found the chance to work within the framework of a collaboration agreement between 
[FIUBA](http://www.fi.uba.ar/) and 
[CoNAE](http://www.conae.gob.ar/) 
(Argentine Space Activities National Agency), through 
[GPSIC](http://psic.fi.uba.ar/) 
(Signal Processing, Identification and Control Research Group), for a national space access program called [Tronador](http://www.conae.gov.ar/index.php/espanol/acceso-al-espacio/tronador-ii).

Some bullet points of this work are described next:
- Designed and developed an algorithm for autonomous orbit transfer, saving 90% of the human operations time in this manoeuvre and removing the risk of communication interruption. There are several strategies to reach a desired orbit, each one with advantages and disadvantages regarding fuel consumption, time spent, risks and costs. The algorithm developed in this thesis is not the fastest, but is optimal in terms of fuel consumption and quicker than traditional satellite orbit transfer.
- Designed and developed an attitude control algorithm, using a Proportional+Derivative law and reaction wheels as actuators.
- Designed and developed a simulation program in Simulink to test spacecraft dynamics and GN&C/sensor fusion algorithms, with accurate results at the same level of high industry software.
- Designed and developed an integrated navigation algorithm using Extended Kalman Filter to fusion data from a conventional GPS and inertial sensors (accelerometers and gyros). This allows us to estimate the position, velocity and attitude of the vehicle in real-time as well as predict future states.
- Analyzed different accelerometers, gyroscopes, IMUs and GPS modules for cost and performance evaluation. I also considered alternative navigation algorithms without accelerometers achieving great results implying a lot of money to save on.

[Link to PDF](Thesis/SLSampayo-Tesis_10Nov16.pdf)


# WebGL Demos

## Amusement Park in WebGL

![Amusement Park][amusement]

I developed this project when I was in college at the course "Graphic Systems [86.43]". There we learnt about 3D models, rotations, translations, 4D spaces, light models, shaders, and more. We used Javascript and WebGL to code several projects. This one was my final project, and the professors selected it as a featured project hosted in the course website. 

[Link to demo](AmusementPark/index-en.html) - [Link to source](https://github.com/sebastian-sampayo/FIUBA--86.43-Sistemas-Graficos/tree/master/TP2-Sampayo)


## KeplerOrbit

![Kepler Orbit][kepler]

I developed this WebGL demo when I was preparing for my Thesis defence. It helps explaining astronomical terminology and classical elements of a Keplerian orbit, as it draws the Earth, the satellite, its orbit, some common frames and reference objects used in my Thesis work. I also used it to take screenshots to enhance some parts of the report.

[Link to demo](KeplerOrbit/index.html) - [Link to source](https://github.com/sebastian-sampayo/KeplerOrbit)

