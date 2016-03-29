# doctape

[Duct Tape](https://en.wikipedia.org/wiki/Duct_tape) super powers to maintain your Docker development environment.

> A clean house is a sign of a wasted life.

... but in my case it consumes to much disk space. Doctape is a simple command line tool to keep the Docker house clean. 
Basically it contains shortcuts to delete images & containers.

## 1. Install
```
npm install doctape -g
```

## 2. Usage

Delete untagged images:
```
doctape rmi_untagged
```

Delete all images
```
doctape rmi_all
```

Delete all exited containers:
```
doctape rm_exited
```

Stop all running containers
```
doctape stopall
```

Show total disk usages:
```
doctape stats
```