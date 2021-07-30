<?php

namespace App\Form;

use App\Entity\FichesClients;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\BirthdayType;
use Symfony\Component\Form\Extension\Core\Type\DateType;
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\HiddenType;
use Symfony\Component\Form\Extension\Core\Type\TelType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;

class FicheClientType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('nom', TextType::class, [
                'label' => 'Nom'
            ])
            ->add('prenom', TextType::class, [
                'label' => 'Prénom'
            ])
            ->add('rdv', HiddenType::class)
            
            ->add('note', TextareaType::class, [
                'label' => 'Note'
            ])
            ->add('email', EmailType::class, [
                'label' => 'E-mail'
            ])
            ->add('tel', TelType::class, [
                'label' => 'Tél'
            ])
            ->add('birthday', BirthdayType::class, [
                'label' => 'Date d\'anniversaire',
                'model_timezone' => 'Europe/Paris'
            ])
            ->add('cp', TextType::class, [
                'label' => 'Code Postal'
            ])
        ;
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => FichesClients::class,
        ]);
    }
}
