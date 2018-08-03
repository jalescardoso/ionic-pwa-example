import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';
declare var window;
import { DomSanitizer } from '@angular/platform-browser';
import * as jdetects from 'jdetects';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Component({
	selector: 'page-home',
	templateUrl: 'home.html'
})
export class HomePage {
	constructor(
		private _sanitizer: DomSanitizer,
		public navCtrl: NavController) {
		new Promise<any>(resolve => window.addEventListener("beforeinstallprompt", resolve))
			.then(ev => {
				console.log('beforeinstallprompt out');
				ev.preventDefault();
				this.prompt = ev;
			})
		this.checkCslOpen = Observable.create(observer => jdetects.create(status => observer.next(status == 'on')))
			.subscribe((open: boolean) => this.consoleOpen = open);
		this.userAgent = navigator.userAgent;
		this.isMob = (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent));
	}
	prompt;
	position;
	photoBlob;
	consoleOpen: boolean;
	checkCslOpen: Subject<any>;
	userAgent;
	isMob;
	@ViewChild('fileInput') fileInput: ElementRef;

	takePicture() {
		if (this.isMobile()) this.fileInput.nativeElement.click();
		else alert('Você deve estar em um dispositivo móvel para tirar photos');
	}

	addHome() {
		if (!this.prompt) return;
		this.prompt.prompt();
	}

	getLoc() {
		new Promise<any>((resolve, reject) => navigator.geolocation.getCurrentPosition(resolve, reject))
			.then(pos => { console.log(pos); this.position = `lat : ${pos.coords.latitude}, lng : ${pos.coords.longitude}`; })
			.catch(err => console.error(err));
	}

	changeImage(e) {
		var file = e.target.files[0];
		this.photoBlob = this._sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(file));
	}

	isMobile() {
		return !this.consoleOpen && (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent));
	};

	ionViewDidLeave() {
		this.checkCslOpen.unsubscribe();
	}
}