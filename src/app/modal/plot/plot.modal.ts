import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'ngbd-modal-content',
    styleUrls: ['./plot.modal.scss'],
    templateUrl: './plot.modal.html'
  })
  export class NgbdPlotModalContent {
    @Input() name: any;
    @Input() plot: any;
  
    constructor(public activeModal: NgbActiveModal) {}
  }